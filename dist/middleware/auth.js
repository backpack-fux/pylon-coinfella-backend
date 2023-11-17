"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddlewareForPartner = exports.authMiddlewareForGraphql = exports.authenticate = exports.parseAuthHeader = void 0;
const passport_1 = __importDefault(require("passport"));
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = require("../config");
const Partner_1 = require("../models/Partner");
const utils_1 = require("../utils");
// TODO: This middleware doesn't force user to be authenticated, This can be used for POST /callers
const parseAuthHeader = async (req, res, next) => {
    passport_1.default.authenticate('bearer-validate', { session: false }, (err, data, info) => {
        if (data && data.user) {
            req.user = trimUser(data.user);
        }
        return next(err);
    })(req, res, next);
};
exports.parseAuthHeader = parseAuthHeader;
const authenticate = async (req, res, next) => {
    passport_1.default.authenticate('bearer-validate', { session: false }, (err, data, info) => {
        if (data && data.user) {
            req.user = trimUser(data.user);
        }
        else {
            return res.error('User not authenticated', 401);
        }
        return next(err);
    })(req, res, next);
};
exports.authenticate = authenticate;
const authMiddlewareForGraphql = async (req, res, next) => {
    passport_1.default.authenticate('bearer-validate', { session: false }, (err, data, info) => {
        if (data && data.user) {
            req.user = trimUser(data.user);
        }
        return next(err);
    })(req, res, next);
};
exports.authMiddlewareForGraphql = authMiddlewareForGraphql;
const trimUser = (user) => {
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
const authMiddlewareForPartner = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401).json({
            message: 'Authentication is required!',
        });
        return;
    }
    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, config_1.Config.jwtSecret, async (err, decoded) => {
        if (err) {
            const message = err.message === 'jwt expired' ? 'Token expired, please login' : err.message;
            res.status(401).json({
                message,
            });
            return;
        }
        const ipAddresses = (req.headers['x-forwarded-for'] || req.socket.remoteAddress);
        const ipAddress = ipAddresses.split(',')[0];
        var userAgent = req.headers['user-agent'];
        if (decoded.ipAddress !== ipAddress) {
            utils_1.log.info({
                func: 'authMiddlewareForPartner',
                ipAddress,
                decoded
            }, 'Mismatch ip address');
            res.status(401).json({
                message: 'Failed Authentication',
            });
            return;
        }
        if (decoded.userAgent !== userAgent) {
            utils_1.log.info({
                func: 'authMiddlewareForPartner',
                userAgent,
                decoded
            }, 'Mismatch user agent');
            res.status(401).json({
                message: 'Failed Authentication',
            });
            return;
        }
        const partner = await Partner_1.Partner.findOne({ where: { id: decoded.id } });
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
        req.partner = partner;
        next();
    });
};
exports.authMiddlewareForPartner = authMiddlewareForPartner;
//# sourceMappingURL=auth.js.map