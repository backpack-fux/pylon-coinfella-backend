import passport from 'passport';
import { RequestHandler } from 'express';
import { User } from '../models/User';
import * as jwt from 'jsonwebtoken';
import { Config } from '../config';
import { Partner } from '../models/Partner';
import { log } from '../utils';

declare global {
  namespace Express {
    interface User {
      id?: string;
      firstName?: string;
      lastName?: string;
      email: string;
      phoneNumber
    }
    interface Request {
      user?: User
      partner?: Partner
    }
  }
}

// TODO: This middleware doesn't force user to be authenticated, This can be used for POST /callers
export const parseAuthHeader: RequestHandler = async (req, res, next) => {
  passport.authenticate('bearer-validate', { session: false }, (err, data, info) => {
    if (data && data.user) {
      req.user = trimUser(data.user);
    }

    return next(err);
  })(req, res, next);
};

export const authenticate: RequestHandler = async (req, res, next) => {
  passport.authenticate('bearer-validate', { session: false }, (err, data, info) => {
    if (data && data.user) {
      req.user = trimUser(data.user);
    } else {
      return res.error('User not authenticated', 401);
    }

    return next(err);
  })(req, res, next);
};

export const authMiddlewareForGraphql: RequestHandler = async (req, res, next) => {
  passport.authenticate('bearer-validate', { session: false }, (err, data, info) => {
    if (data && data.user) {
      req.user = trimUser(data.user);
    }

    return next(err);
  })(req, res, next);
};

const trimUser = (user: User) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    status: user.status,
    isVerified: user.isVerified
  };
};

export const authMiddlewareForPartner: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({
      message: 'Authentication is required!',
    });
    return;
  }

  const token = authorization.replace('Bearer ', '');

  jwt.verify(token, Config.jwtSecret, async (err: any, decoded: any) => {
    if (err) {
      const message = err.message === 'jwt expired' ? 'Token expired, please login' : err.message;
      res.status(401).json({
        message,
      });
      return;
    }

    const ipAddresses = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string
    const ipAddress = ipAddresses.split(',')[0]
    var userAgent = req.headers['user-agent'];


    if (decoded.ipAddress !== ipAddress) {
      log.info({
        func: 'authMiddlewareForPartner',
        ipAddress,
        decoded
      }, 'Mismatch ip address')
      res.status(401).json({
        message: 'Failed Authentication',
      });
      return;
    }

    if (decoded.userAgent !== userAgent) {
      log.info({
        func: 'authMiddlewareForPartner',
        userAgent,
        decoded
      }, 'Mismatch user agent')
 
      res.status(401).json({
        message: 'Failed Authentication',
      });
      return;
    }

    const partner = await Partner.findOne({ where: { id: decoded.id } });

    if (!partner) {
      res.status(401).json({
        message: 'Partner not found, please login',
      });
      return;
    }

    // if (!partner.isApproved) {
    //   res.status(422).json({
    //     message: 'Your account is not approved yet. please wait.',
    //   });
    // }

    req.partner = partner

    next();
  });
};
