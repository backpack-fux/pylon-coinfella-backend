// Settings

// Dependencies

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Config } from '../config';

/**
 * Provides operations for user authentication.
 */
export class UserService {
  // Generate JWT Auth Token with a user
  static generateJWTToken(user: any) {
    const token = jwt.sign(user, Config.jwtSecret, { expiresIn: `${Config.jwtExpires}h` });
    return token;
  }

  static async encryptPassword(password: string) {
    if (!password) {
      throw new Error('No password was provided.');
    }

    const salt: string = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, encryptedPassword: string) {
    return bcrypt.compare(password, encryptedPassword);
  }
}
