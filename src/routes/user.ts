// MODULES
import * as express from 'express';
import { check, validationResult } from 'express-validator';
import { UserService } from '../services/userService';
import passport from 'passport';
import { UserStatus } from '../types/userStatus.type';

const router = express.Router();

router.post('/login', async (req, res, next) => {
  await check('email', 'Email is not valid').isEmail().run(req);
  await check('password', 'Password cannot be blank').notEmpty().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.error('Validation failed');
  }

  return passport.authenticate('local', async (err: Error, user: any, info: any) => {
    if (err || info) {
      return res.error(err?.message || info?.message || err, 401);
    }

    if (!user) {
      return res.error('Invalid email or password', 401);
    }

    return res.status(202).json(UserService.generateJWTToken({
      id: user.id,
      email: user.email
    }));
  })(req, res, next);
});

export = router;
