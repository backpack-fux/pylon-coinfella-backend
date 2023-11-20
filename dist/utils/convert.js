"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOrder = exports.convertToCharge = void 0;
const chargeErrors_1 = require("../errors/chargeErrors");
const currency_1 = require("./currency");
const convertToCharge = (charge) => {
    var _a, _b, _c;
    const chargeAmount = (0, currency_1.newDinero)(Number(charge.amount), charge.currency);
    return {
        id: charge.id,
        status: charge.status,
        amount: chargeAmount.toUnit(),
        currency: chargeAmount.getCurrency(),
        approved: charge.approved,
        flagged: (_a = charge.risk) === null || _a === void 0 ? void 0 : _a.flagged,
        processedOn: charge.processed_on,
        reference: charge.reference,
        last4: (_b = charge.source) === null || _b === void 0 ? void 0 : _b.last4,
        bin: (_c = charge.source) === null || _c === void 0 ? void 0 : _c.bin,
        code: charge.response_code,
        message: chargeErrors_1.chargeMessages[charge.response_code],
    };
};
exports.convertToCharge = convertToCharge;
const normalizeOrder = (checkoutRequest) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30;
    return {
        id: checkoutRequest.id,
        walletAddress: checkoutRequest.walletAddress,
        email: checkoutRequest.email,
        phoneNumber: checkoutRequest.phoneNumber,
        status: checkoutRequest.status,
        partnerOrderId: checkoutRequest.partnerOrderId,
        transactionHash: (_b = (_a = checkoutRequest.checkout) === null || _a === void 0 ? void 0 : _a.assetTransfer) === null || _b === void 0 ? void 0 : _b.transactionHash,
        feeAmount: (_c = checkoutRequest.checkout) === null || _c === void 0 ? void 0 : _c.feeAmountMoney.toUnit(),
        tipAmount: (_d = checkoutRequest.checkout) === null || _d === void 0 ? void 0 : _d.tipAmountMoney.toUnit(),
        chargeAmount: (_e = checkoutRequest.checkout) === null || _e === void 0 ? void 0 : _e.totalChargeAmountMoney.toUnit(),
        unitAmount: (_g = (_f = checkoutRequest.checkout) === null || _f === void 0 ? void 0 : _f.assetTransfer) === null || _g === void 0 ? void 0 : _g.amount,
        chargeId: (_j = (_h = checkoutRequest.checkout) === null || _h === void 0 ? void 0 : _h.charge) === null || _j === void 0 ? void 0 : _j.id,
        chargeCode: (_l = (_k = checkoutRequest.checkout) === null || _k === void 0 ? void 0 : _k.charge) === null || _l === void 0 ? void 0 : _l.code,
        chargeMsg: (_o = (_m = checkoutRequest.checkout) === null || _m === void 0 ? void 0 : _m.charge) === null || _o === void 0 ? void 0 : _o.message,
        chargeStatus: (_q = (_p = checkoutRequest.checkout) === null || _p === void 0 ? void 0 : _p.charge) === null || _q === void 0 ? void 0 : _q.status,
        last4: (_s = (_r = checkoutRequest.checkout) === null || _r === void 0 ? void 0 : _r.charge) === null || _s === void 0 ? void 0 : _s.last4,
        customer: {
            id: (_u = (_t = checkoutRequest.checkout) === null || _t === void 0 ? void 0 : _t.user) === null || _u === void 0 ? void 0 : _u.id,
            firstName: ((_w = (_v = checkoutRequest.checkout) === null || _v === void 0 ? void 0 : _v.user) === null || _w === void 0 ? void 0 : _w.firstName) ||
                ((_x = checkoutRequest.checkout) === null || _x === void 0 ? void 0 : _x.firstName),
            lastName: ((_z = (_y = checkoutRequest.checkout) === null || _y === void 0 ? void 0 : _y.user) === null || _z === void 0 ? void 0 : _z.lastName) ||
                ((_0 = checkoutRequest.checkout) === null || _0 === void 0 ? void 0 : _0.lastName),
            email: ((_2 = (_1 = checkoutRequest.checkout) === null || _1 === void 0 ? void 0 : _1.user) === null || _2 === void 0 ? void 0 : _2.email) ||
                ((_3 = checkoutRequest.checkout) === null || _3 === void 0 ? void 0 : _3.email),
            phoneNumber: ((_5 = (_4 = checkoutRequest.checkout) === null || _4 === void 0 ? void 0 : _4.user) === null || _5 === void 0 ? void 0 : _5.phoneNumber) ||
                ((_6 = checkoutRequest.checkout) === null || _6 === void 0 ? void 0 : _6.phoneNumber),
            ssn: (_8 = (_7 = checkoutRequest.checkout) === null || _7 === void 0 ? void 0 : _7.user) === null || _8 === void 0 ? void 0 : _8.ssn,
            dob: (_10 = (_9 = checkoutRequest.checkout) === null || _9 === void 0 ? void 0 : _9.user) === null || _10 === void 0 ? void 0 : _10.dob,
            status: (_12 = (_11 = checkoutRequest.checkout) === null || _11 === void 0 ? void 0 : _11.user) === null || _12 === void 0 ? void 0 : _12.status,
            streetAddress: ((_14 = (_13 = checkoutRequest.checkout) === null || _13 === void 0 ? void 0 : _13.user) === null || _14 === void 0 ? void 0 : _14.streetAddress) ||
                ((_15 = checkoutRequest.checkout) === null || _15 === void 0 ? void 0 : _15.streetAddress),
            streetAddress2: ((_17 = (_16 = checkoutRequest.checkout) === null || _16 === void 0 ? void 0 : _16.user) === null || _17 === void 0 ? void 0 : _17.streetAddress2) ||
                ((_18 = checkoutRequest.checkout) === null || _18 === void 0 ? void 0 : _18.streetAddress2),
            city: ((_20 = (_19 = checkoutRequest.checkout) === null || _19 === void 0 ? void 0 : _19.user) === null || _20 === void 0 ? void 0 : _20.city) || ((_21 = checkoutRequest.checkout) === null || _21 === void 0 ? void 0 : _21.city),
            postalCode: ((_23 = (_22 = checkoutRequest.checkout) === null || _22 === void 0 ? void 0 : _22.user) === null || _23 === void 0 ? void 0 : _23.postalCode) ||
                ((_24 = checkoutRequest.checkout) === null || _24 === void 0 ? void 0 : _24.postalCode),
            state: ((_26 = (_25 = checkoutRequest.checkout) === null || _25 === void 0 ? void 0 : _25.user) === null || _26 === void 0 ? void 0 : _26.state) ||
                ((_27 = checkoutRequest.checkout) === null || _27 === void 0 ? void 0 : _27.state),
            country: ((_29 = (_28 = checkoutRequest.checkout) === null || _28 === void 0 ? void 0 : _28.user) === null || _29 === void 0 ? void 0 : _29.country) ||
                ((_30 = checkoutRequest.checkout) === null || _30 === void 0 ? void 0 : _30.country),
        },
    };
};
exports.normalizeOrder = normalizeOrder;
//# sourceMappingURL=convert.js.map