"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputError = void 0;
class InputError extends Error {
    constructor(message, code, status = 400, innerError) {
        // Calling parent constructor of base Error class.
        super(message);
        this.message = message;
        this.code = code;
        this.status = status;
        this.innerError = innerError;
        // Saving class name in the property of our custom error as a shortcut.
        this.name = this.constructor.name;
        this.code = code;
        this.status = status;
        this.innerError = innerError;
        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.InputError = InputError;
//# sourceMappingURL=InputError.js.map