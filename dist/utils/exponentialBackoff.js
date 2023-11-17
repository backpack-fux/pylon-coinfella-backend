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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exponentialBackOff = void 0;
const moment = __importStar(require("moment-timezone"));
const retry = __importStar(require("retry"));
const _1 = require(".");
const exponentialBackOff = async (funcPromise, options = {
    factor: 1,
    retries: 5,
    retryErrorKey: 'message',
    retryErrorValue: [
        'nonce too low',
        'request failed or timed out',
        'Request failed with status code',
        'socket hang up',
        'connect ETIMEDOUT',
        'Your app has exceeded',
        '504 Gateway Time-out',
        'ECONNRESET',
        'Invalid JSON RPC response',
        'aborted', // alchemy getOwnersForCollection
    ],
    retryTimeout: null,
}) => {
    const { retryErrorKey, retryErrorValue, retryTimeout, ...retryOptions } = options;
    const retryOperation = retry.operation(retryOptions || {});
    const startTime = moment.utc();
    return new Promise((resolve, reject) => {
        retryOperation.attempt(async (currentAttempt) => {
            let result = null;
            let lastError = null;
            try {
                result = await funcPromise();
            }
            catch (err) {
                lastError = err;
                const isRetryErrorMismatch = retryErrorKey
                    && retryErrorValue
                    && !retryErrorValue.find((value) => {
                        var _a, _b;
                        return lastError[retryErrorKey] === value
                            || (((_a = lastError[retryErrorKey]) === null || _a === void 0 ? void 0 : _a.includes)
                                && ((_b = lastError[retryErrorKey].toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes(value.toLowerCase())));
                    });
                const isRetryTimeout = retryTimeout
                    && moment
                        .utc()
                        .isAfter(startTime.clone().add(retryTimeout, 'milliseconds'));
                _1.log.info({
                    func: 'exponentialBackOff',
                    isRetryErrorMismatch,
                    isRetryTimeout,
                    currentAttempt,
                    retryErrorKey,
                    retryErrorValue,
                    lastError,
                    retryFunc: funcPromise.name,
                }, 'exponentialBackOff');
                if (isRetryErrorMismatch || isRetryTimeout) {
                    retryOperation.stop();
                    reject(lastError);
                    return;
                }
                if (retryOperation.retry(lastError)) {
                    return;
                }
            }
            if (lastError) {
                reject(retryOperation.mainError());
                return;
            }
            resolve({
                attempts: currentAttempt,
                result,
            });
        });
    });
};
exports.exponentialBackOff = exponentialBackOff;
//# sourceMappingURL=exponentialBackoff.js.map