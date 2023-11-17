"use strict";
// Settings
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// Dependencies
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("../config");
/**
 * Provides operations for user authentication.
 */
class UserService {
    // Generate JWT Auth Token with a user
    static generateJWTToken(user) {
        const token = jwt.sign(user, config_1.Config.jwtSecret, { expiresIn: `${config_1.Config.jwtExpires}h` });
        return token;
    }
    static async encryptPassword(password) {
        if (!password) {
            throw new Error('No password was provided.');
        }
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    static async comparePassword(password, encryptedPassword) {
        return bcrypt.compare(password, encryptedPassword);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map