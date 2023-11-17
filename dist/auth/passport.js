"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPassport = void 0;
// Settings
const config_1 = require("../config");
const passport_local_1 = require("passport-local");
const passport_http_bearer_1 = require("passport-http-bearer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Models
const models_1 = __importDefault(require("../models"));
const initPassport = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        models_1.default.User.findByPk(id).then((user) => {
            done(null, { user });
        }).catch((error) => {
            done(error);
        });
    });
    /**
     * Sign in using Email and Password.
     */
    passport.use(new passport_local_1.Strategy({ usernameField: 'email' }, (emailParam, password, done) => {
        const email = emailParam.toLowerCase();
        models_1.default.User.findUser(email, password, async (err, user) => {
            if (err) {
                return done(err, null);
            }
            try {
                delete user.password;
                return done(null, user);
            }
            catch (error) {
                return done(error, null);
            }
        });
    }));
    /**
     * Authenticate using token.
     */
    passport.use('bearer-validate', new passport_http_bearer_1.Strategy({ passReqToCallback: true, realm: null, scope: null }, async (req, token, done) => {
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            if (decoded === null || decoded === void 0 ? void 0 : decoded.id) {
                jsonwebtoken_1.default.verify(token, config_1.Config.jwtSecret);
                const user = await models_1.default.User.findByPk(decoded.id);
                if (!user) {
                    throw new Error('Can not find user!');
                }
                return done(null, { user });
            }
            else {
                return done(null);
            }
        }
        catch (err) {
            return done(null);
        }
    }));
};
exports.initPassport = initPassport;
//# sourceMappingURL=passport.js.map