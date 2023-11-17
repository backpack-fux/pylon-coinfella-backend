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
exports.KycService = void 0;
const moment = __importStar(require("moment-timezone"));
const KycLink_1 = require("../models/KycLink");
const sequelize_1 = require("sequelize");
const userStatus_type_1 = require("../types/userStatus.type");
const tosStatus_type_1 = require("../types/tosStatus.type");
const bridgeService_1 = require("./bridgeService");
const User_1 = require("../models/User");
const Partner_1 = require("../models/Partner");
const notificationService_1 = require("./notificationService");
const userService_1 = require("./userService");
const utils_1 = require("../utils");
const notificationService = notificationService_1.NotificationService.getInstance();
const bridgeServiceInstance = bridgeService_1.BridgeService.getInstance();
class KycService {
    constructor(bridgeService, notificationService) {
        this.bridgeService = bridgeService;
        this.notificationService = notificationService;
    }
    static getInstance() {
        return new KycService(bridgeServiceInstance, notificationService);
    }
    async getKycLinks10Minutes() {
        return KycLink_1.KycLink.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: moment.utc().subtract(10, "minutes").toDate(),
                },
                [sequelize_1.Op.or]: [
                    {
                        kycStatus: { [sequelize_1.Op.notIn]: [userStatus_type_1.UserStatus.Active, userStatus_type_1.UserStatus.Rejected] },
                    },
                    {
                        tosLink: tosStatus_type_1.TosStatus.Pending,
                    },
                ],
            },
        });
    }
    async getKycLinksInAnHour() {
        return KycLink_1.KycLink.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.lt]: moment.utc().subtract(10, "minutes").toDate(),
                    [sequelize_1.Op.gte]: moment.utc().subtract(1, "hour").toDate(),
                },
                [sequelize_1.Op.or]: [
                    {
                        kycStatus: { [sequelize_1.Op.notIn]: [userStatus_type_1.UserStatus.Active, userStatus_type_1.UserStatus.Rejected] },
                    },
                    {
                        tosLink: tosStatus_type_1.TosStatus.Pending,
                    },
                ],
            },
        });
    }
    async getKycLinksIn2Days() {
        return KycLink_1.KycLink.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.lt]: moment.utc().subtract(1, "hour").toDate(),
                    [sequelize_1.Op.gte]: moment.utc().subtract(2, "day").toDate(),
                },
                [sequelize_1.Op.or]: [
                    {
                        kycStatus: { [sequelize_1.Op.notIn]: [userStatus_type_1.UserStatus.Active, userStatus_type_1.UserStatus.Rejected] },
                    },
                    {
                        tosLink: tosStatus_type_1.TosStatus.Pending,
                    },
                ],
            },
        });
    }
    async getKycLinksIn10Days() {
        return KycLink_1.KycLink.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.lt]: moment.utc().subtract(2, "day").toDate(),
                    [sequelize_1.Op.gte]: moment.utc().subtract(10, "days").toDate(),
                },
                [sequelize_1.Op.or]: [
                    {
                        kycStatus: { [sequelize_1.Op.notIn]: [userStatus_type_1.UserStatus.Active, userStatus_type_1.UserStatus.Rejected] },
                    },
                    {
                        tosLink: tosStatus_type_1.TosStatus.Pending,
                    },
                ],
            },
        });
    }
    async syncKycIn10Minutes() {
        const kycLinks = await this.getKycLinks10Minutes();
        await this.syncKycLinks(kycLinks);
    }
    async syncKycInAnHour() {
        const kycLinks = await this.getKycLinksInAnHour();
        await this.syncKycLinks(kycLinks);
    }
    async syncKycIn2Days() {
        const kycLinks = await this.getKycLinksIn2Days();
        await this.syncKycLinks(kycLinks);
    }
    async syncKycIn10Days() {
        const kycLinks = await this.getKycLinksIn10Days();
        await this.syncKycLinks(kycLinks);
    }
    async syncKycLinks(kycLinks) {
        if (!kycLinks.length) {
            return;
        }
        utils_1.log.info({
            func: "syncKycLinks",
            kycLinkIds: kycLinks.map((link) => link.id),
        }, "syncKycLinks Start");
        for (let i = 0; i < kycLinks.length; i += 1) {
            const kycLink = await kycLinks[i];
            try {
                await this.syncKyc(kycLink);
            }
            catch (err) {
                utils_1.log.warn({
                    func: "syncKycLinks",
                    kycLinkId: kycLink.id,
                }, "syncKycLinks Error");
            }
        }
    }
    async syncKyc(kycLink) {
        if (kycLink.associatedObjectType === "user") {
            if (kycLink.associatedUserType === "user") {
                return this.syncUserByCustomer(kycLink);
            }
            return this.syncUserByKycLink(kycLink);
        }
        if (kycLink.associatedUserType === "user") {
            return this.syncPartnerByCustomer(kycLink);
        }
        return this.syncPartnerByKycLink(kycLink);
    }
    async syncUserByCustomer(kycLink) {
        if (!kycLink.customerId) {
            return;
        }
        const user = await User_1.User.findByPk(kycLink.userId);
        if (!user) {
            return;
        }
        const userStatus = user.status;
        const res = await this.bridgeService.getCustomer(kycLink.customerId);
        await user.sequelize.transaction(async (t) => {
            await user.update({
                status: res.status,
                requirementsDue: res.requirements_due,
                futureRequirementsDue: res.future_requirements_due,
            }, { transaction: t });
            await kycLink.update({
                kycStatus: res.status,
            }, { transaction: t });
        });
        if (userStatus === user.status) {
            return;
        }
        await this.notificationService.publishUserStatus({
            userId: user.id,
            status: user.state,
            token: userService_1.UserService.generateJWTToken({
                id: user.id,
                email: user.email,
            }),
            error: "",
        });
    }
    async syncUserByKycLink(kycLink) {
        const user = await User_1.User.findByPk(kycLink.userId);
        if (!user) {
            return;
        }
        const userStatus = user.status;
        await user.sequelize.transaction(async (t) => {
            const kycLinkRes = await this.bridgeService.getKycLink(kycLink.id);
            await kycLink.update({
                kycStatus: kycLinkRes.kyc_status,
                tosStatus: kycLinkRes.tos_status,
            }, { transaction: t });
            if (kycLinkRes.customer_id) {
                const customer = await this.bridgeService.getCustomer(kycLinkRes.customer_id);
                await user.update({
                    status: customer.status,
                    requirementsDue: customer.requirements_due,
                    futureRequirementsDue: customer.future_requirements_due,
                }, { transaction: t });
            }
        });
        if (userStatus === user.status) {
            return;
        }
        await this.notificationService.publishUserStatus({
            userId: user.id,
            status: user.state,
            token: userService_1.UserService.generateJWTToken({
                id: user.id,
                email: user.email,
            }),
            error: "",
        });
    }
    async syncPartnerByCustomer(kycLink) {
        if (!kycLink.customerId) {
            return;
        }
        const partner = await Partner_1.Partner.findByPk(kycLink.userId);
        if (!partner) {
            return;
        }
        const partnerStatus = partner.status;
        const res = await this.bridgeService.getCustomer(kycLink.customerId);
        await partner.sequelize.transaction(async (t) => {
            await partner.update({
                status: res.status,
            }, { transaction: t });
            await kycLink.update({
                kycStatus: res.status,
            }, { transaction: t });
        });
        if (partner.status === partnerStatus) {
            return;
        }
        await partner.sendWebhook(partner.id, "account", {
            id: partner.id,
            firstName: partner.firstName,
            lastName: partner.lastName,
            email: partner.email,
            phoneNumber: partner.phoneNumber,
            ssn: partner.ssn,
            dob: partner.dob,
            status: partner.status,
            streetAddress: partner.streetAddress,
            streetAddress2: partner.streetAddress2,
            city: partner.city,
            postalCode: partner.postalCode,
            state: partner.state,
            country: partner.country,
        });
    }
    async syncPartnerByKycLink(kycLink) {
        const partner = await Partner_1.Partner.findByPk(kycLink.userId);
        if (!partner) {
            return;
        }
        const partnerStatus = partner.status;
        await partner.sequelize.transaction(async (t) => {
            const kycLinkRes = await this.bridgeService.getKycLink(kycLink.id);
            await kycLink.update({
                kycStatus: kycLinkRes.kyc_status,
                tosStatus: kycLinkRes.tos_status,
            }, { transaction: t });
            if (kycLinkRes.customer_id) {
                const customer = await this.bridgeService.getCustomer(kycLinkRes.customer_id);
                await partner.update({
                    status: customer.status,
                }, { transaction: t });
            }
        });
        if (partner.status === partnerStatus) {
            return;
        }
        await partner.sendWebhook(partner.id, "account", {
            id: partner.id,
            firstName: partner.firstName,
            lastName: partner.lastName,
            email: partner.email,
            phoneNumber: partner.phoneNumber,
            ssn: partner.ssn,
            dob: partner.dob,
            status: partner.status,
            streetAddress: partner.streetAddress,
            streetAddress2: partner.streetAddress2,
            city: partner.city,
            postalCode: partner.postalCode,
            state: partner.state,
            country: partner.country,
        });
    }
}
exports.KycService = KycService;
//# sourceMappingURL=kycService.js.map