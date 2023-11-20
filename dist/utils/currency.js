"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAnyDineroPropertiesToAmount = exports.newDineroDollars = exports.newDinero = exports.isInstanceOfDinero = void 0;
const dinero_js_1 = __importDefault(require("dinero.js"));
const isInstanceOfDinero = (money) => {
    // Lets assume that money is Dinero instance if the money has getAmount and getCurrency property
    return !!(money && money.getAmount && money.getCurrency);
};
exports.isInstanceOfDinero = isInstanceOfDinero;
function newDinero(amountInCents, currency = 'USD') {
    if (isNaN(amountInCents)) {
        throw new Error('amount should be a number');
    }
    // amount is comming as cent, so we round it to integer
    const rounderAmountInCents = Math.round(amountInCents);
    // @ts-ignore
    return (0, dinero_js_1.default)({ amount: rounderAmountInCents, currency });
}
exports.newDinero = newDinero;
function newDineroDollars(amountInDollars, currency = 'USD') {
    return newDinero(amountInDollars * 100, currency);
}
exports.newDineroDollars = newDineroDollars;
function convertAnyDineroPropertiesToAmount(params) {
    for (const param in params) {
        if ((0, exports.isInstanceOfDinero)(params[param])) {
            params[param] = params[param].getAmount();
        }
    }
}
exports.convertAnyDineroPropertiesToAmount = convertAnyDineroPropertiesToAmount;
//# sourceMappingURL=currency.js.map