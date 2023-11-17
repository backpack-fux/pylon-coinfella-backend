// Settings
import { Config } from '../config';

// Dependencies
import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import jwt from 'jsonwebtoken';

// Models
import models from '../models';
import { User } from '../models/User';

export const initPassport = (passport: PassportStatic) => {

  passport.serializeUser((user: any, done: Function) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: string, done: any) => {
    models.User.findByPk(id).then((user) => {
      done(null, { user });
    }).catch((error) => {
      done(error);
    });
  });

  /**
   * Sign in using Email and Password.
   */
  passport.use(new LocalStrategy({ usernameField: 'email' }, (emailParam, password, done) => {
    const email = emailParam.toLowerCase();
    models.User.findUser(email, password, async (err: Error, user: User) => {
      if (err) {
        return done(err, null);
      }

      try {
        delete user.password;
        return done(null, user as any);
      } catch (error: any) {
        return done(error, null);
      }
    });
  }));

  /**
   * Authenticate using token.
   */
  passport.use('bearer-validate', new BearerStrategy({ passReqToCallback: true, realm: null, scope: null }, async (req: any, token: string, done: any) => {
    try {
      const decoded: any = jwt.decode(token);

      if (decoded?.id) {
        jwt.verify(token, Config.jwtSecret);

        const user = await models.User.findByPk(decoded.id);
        if (!user) {
          throw new Error('Can not find user!');
        }
        return done(null, { user });
      } else {
        return done(null);
      }
    } catch (err: any) {
      return done(null);
    }
  }));
};
