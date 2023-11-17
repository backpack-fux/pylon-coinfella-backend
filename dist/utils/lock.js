"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncLock = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
let lock;
const asyncLock = (resource, funcPromise) => {
    if (!lock) {
        lock = new async_lock_1.default();
    }
    return lock.acquire(resource, funcPromise);
};
exports.asyncLock = asyncLock;
//# sourceMappingURL=lock.js.map