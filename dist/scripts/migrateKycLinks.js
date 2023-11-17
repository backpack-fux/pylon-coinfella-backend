"use strict";
// TS_NODE_FILES=true node_modules/.bin/ts-node src/scripts/migrateKycLinks.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateKycLink = void 0;
// models
require("../models");
const KycLink_1 = require("../models/KycLink");
const Partner_1 = require("../models/Partner");
const User_1 = require("../models/User");
const tosStatus_type_1 = require("../types/tosStatus.type");
const migrateKycLink = async (kycLink) => {
    const user = await User_1.User.findByPk(kycLink.userId);
    if (user) {
        return kycLink.update({
            associatedObjectType: "user",
            associatedUserType: "user",
            customerId: kycLink.userId,
            kycStatus: user.status,
            email: user.email,
            tosStatus: tosStatus_type_1.TosStatus.Approved,
        });
    }
    const partner = await Partner_1.Partner.findByPk(kycLink.userId);
    if (!partner) {
        return;
    }
    return kycLink.update({
        associatedObjectType: "user",
        associatedUserType: "partner",
        customerId: kycLink.userId,
        kycStatus: partner.status,
        email: partner.email,
        tosStatus: tosStatus_type_1.TosStatus.Approved,
    });
};
exports.migrateKycLink = migrateKycLink;
const migrateKycLinks = async () => {
    const kycLinks = await KycLink_1.KycLink.findAll();
    for (const kycLink of kycLinks) {
        await (0, exports.migrateKycLink)(kycLink);
    }
};
(async () => {
    try {
        await migrateKycLinks();
    }
    catch (err) {
        console.log("migrateKycLinks", err);
    }
    process.exit(0);
})();
//# sourceMappingURL=migrateKycLinks.js.map