import { Express } from 'express';
import passport from 'passport';
import { initPassport } from './passport';

export const initAuth = (app: Express) => {

  app.use(passport.initialize());
  // Other middlewares
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });

  // Configure passport
  initPassport(passport);

  return passport;
};
