"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./passport");
const initAuth = (app) => {
    app.use(passport_1.default.initialize());
    // Other middlewares
    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    });
    // Configure passport
    (0, passport_2.initPassport)(passport_1.default);
    return passport_1.default;
};
exports.initAuth = initAuth;
//# sourceMappingURL=index.js.map