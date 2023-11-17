"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customAuthChecker = void 0;
const ALL_ROLES = [
    'admin',
    'director',
    'supervisor',
    'lossPrevention',
    'qualityAssurance',
    'teamLead',
    'operator',
    'partner',
    'customer',
    'family',
];
// create auth checker function
const customAuthChecker = ({ context: { user } }, roles) => {
    return !!user;
};
exports.customAuthChecker = customAuthChecker;
//# sourceMappingURL=authChecker.js.map