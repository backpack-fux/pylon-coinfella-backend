"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resError = void 0;
const config_1 = require("../config");
function resError(req, res, next) {
    res.error = function (messageOrError, code = 400, issues = [], showToUser = true) {
        if (typeof messageOrError === 'string') {
            const message = messageOrError;
            return res.status(code).json({
                success: false,
                code,
                message: message || 'Server error',
                issues,
                showToUser,
            });
        }
        else {
            const err = messageOrError;
            const copy = Object.assign({}, err);
            if (config_1.Config.isProduction) {
                delete copy.stack;
            }
            try {
                return this.json(copy);
            }
            catch (e) {
                return this.json({ message: copy.message, status: copy.status });
            }
        }
    };
    next();
}
exports.resError = resError;
//# sourceMappingURL=resError.js.map