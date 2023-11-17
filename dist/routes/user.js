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
// MODULES
const express = __importStar(require("express"));
const express_validator_1 = require("express-validator");
const userService_1 = require("../services/userService");
const passport_1 = __importDefault(require("passport"));
const router = express.Router();
router.post('/login', async (req, res, next) => {
    await (0, express_validator_1.check)('email', 'Email is not valid').isEmail().run(req);
    await (0, express_validator_1.check)('password', 'Password cannot be blank').notEmpty().run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.error('Validation failed');
    }
    return passport_1.default.authenticate('local', async (err, user, info) => {
        if (err || info) {
            return res.error((err === null || err === void 0 ? void 0 : err.message) || (info === null || info === void 0 ? void 0 : info.message) || err, 401);
        }
        if (!user) {
            return res.error('Invalid email or password', 401);
        }
        return res.status(202).json(userService_1.UserService.generateJWTToken({
            id: user.id,
            email: user.email
        }));
    })(req, res, next);
});
module.exports = router;
//# sourceMappingURL=user.js.map