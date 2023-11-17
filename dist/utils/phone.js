"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPhoneNumber = exports.normalizePhoneNumber = void 0;
const libphonenumber_js_1 = require("libphonenumber-js");
const normalizePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
        return null;
    }
    try {
        let phoneNumberObject = (0, libphonenumber_js_1.parsePhoneNumber)(phoneNumber);
        let isValid = phoneNumberObject && (0, exports.isPhoneNumber)(phoneNumberObject.number);
        if (isValid) {
            return phoneNumberObject.number;
        }
        const phoneNumberWithPlus = `+${phoneNumber.replace(/[()+\- ]/g, '')}`;
        phoneNumberObject = (0, libphonenumber_js_1.parsePhoneNumber)(phoneNumberWithPlus);
        isValid = phoneNumberObject && (0, exports.isPhoneNumber)(phoneNumberObject.number);
        if (isValid) {
            return phoneNumberObject.number;
        }
    }
    catch (err) {
        // silent fail
    }
    const normalizedNumber = phoneNumber.replace(/[()+\- ]/g, '');
    const isPhoneNumberWithPlus = (0, exports.isPhoneNumber)(`+${normalizedNumber}`);
    if (isPhoneNumberWithPlus) {
        // prepend + sign
        return `+${normalizedNumber}`;
    }
    return normalizedNumber;
};
exports.normalizePhoneNumber = normalizePhoneNumber;
const isPhoneNumber = (n) => {
    if (!n) {
        return false;
    }
    return (0, libphonenumber_js_1.isValidPhoneNumber)(n);
};
exports.isPhoneNumber = isPhoneNumber;
//# sourceMappingURL=phone.js.map