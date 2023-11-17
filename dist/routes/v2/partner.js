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
const config_1 = require("../../config");
// MODULES
const express = __importStar(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../../middleware/auth");
const CheckoutRequest_1 = require("../../models/CheckoutRequest");
const Partner_1 = require("../../models/Partner");
const userService_1 = require("../../services/userService");
const bridgeService_1 = require("../../services/bridgeService");
const utils_1 = require("../../utils");
const KycLink_1 = require("../../models/KycLink");
const userStatus_type_1 = require("../../types/userStatus.type");
const Checkout_1 = require("../../models/Checkout");
const Charge_1 = require("../../models/Charge");
const AssetTransfer_1 = require("../../models/AssetTransfer");
const User_1 = require("../../models/User");
const convert_1 = require("../../utils/convert");
const tosStatus_type_1 = require("../../types/tosStatus.type");
const router = express.Router();
const bridgeService = bridgeService_1.BridgeService.getInstance();
router.post("/v2/partners", async (req, res) => {
    const data = req.body;
    utils_1.log.info({
        func: "partners",
        data,
    });
    try {
        await (0, express_validator_1.check)("firstName", "First name is required").notEmpty().run(req);
        await (0, express_validator_1.check)("lastName", "Last name is required").notEmpty().run(req);
        await (0, express_validator_1.check)("email", "Email is required").notEmpty().run(req);
        await (0, express_validator_1.check)("email", "Email is invalid").isEmail().run(req);
        await (0, express_validator_1.check)("password", "Password is required").notEmpty().run(req);
        await (0, express_validator_1.check)("password", "Please set strong password")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .run(req);
        await (0, express_validator_1.check)("companyName", "Company name is required").notEmpty().run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            errors.throw();
        }
        const existingUserEmail = await Partner_1.Partner.findOne({
            where: {
                email: data.email,
            },
        });
        if (existingUserEmail) {
            throw new Error(`Already exists account with email: ${data.email}`);
        }
        const partner = await Partner_1.Partner.sequelize.transaction(async (t) => {
            const partner = await Partner_1.Partner.create({
                ...data,
            }, { transaction: t });
            const response = await bridgeService.createKycLink({
                idempotencyKey: partner.id,
                name: partner.name,
                email: partner.email,
                type: "business",
            });
            const kycLink = await KycLink_1.KycLink.create({
                id: response.id,
                userId: partner.id,
                email: response.email,
                type: response.type,
                kycLink: response.kyc_link,
                tosLink: response.tos_link,
                kycStatus: response.kyc_status,
                tosStatus: response.tos_status,
                associatedObjectType: "kycLink",
                associatedUserType: "partner",
            }, { transaction: t });
            return {
                id: partner.id,
                kycLink: kycLink.kycLink,
                tosLink: kycLink.tosLink,
            };
        });
        res.status(201).json({
            ...partner,
            message: "Created your account successfully.",
        });
    }
    catch (err) {
        utils_1.log.warn({
            func: "partners",
            data,
            err,
        }, "Failed create partner");
        if (err.mapped && err.mapped()) {
            return res.status(422).send({
                message: "Failed validation",
                errors: err.mapped(),
            });
        }
        if (err.code) {
            return res.status(400).send(err);
        }
        res.status(400).send({
            message: err.message,
        });
    }
});
router.post("/v2/partners/login", async (req, res) => {
    try {
        await (0, express_validator_1.check)("email", "Email is invalid").optional().isEmail().run(req);
        await (0, express_validator_1.check)("password", "Password cannot be blank").notEmpty().run(req);
        await (0, express_validator_1.check)("password", "Please set strong password")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            errors.throw();
        }
        const { email, password } = req.body;
        const ipAddresses = (req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress);
        const ipAddress = ipAddresses.split(",")[0];
        const userAgent = req.headers["user-agent"];
        const partner = await Partner_1.Partner.findPartner(email, password);
        if (!partner) {
            throw new Error("Invalid email or password");
        }
        const token = await userService_1.UserService.generateJWTToken({
            id: partner.id,
            email: partner.email,
            ipAddress,
            userAgent,
        });
        return res.status(202).json({ token });
    }
    catch (error) {
        if (error.mapped && error.mapped()) {
            return res.status(422).send({
                message: "Failed validation",
                errors: error.mapped(),
            });
        }
        if (error.code) {
            return res.status(400).send(error);
        }
        res.status(400).send({
            message: error.message || "Error",
        });
    }
});
router.patch("/v2/partners", auth_1.authMiddlewareForPartner, async (req, res) => {
    const partner = req.partner;
    const { webhook, displayName, fee } = req.body;
    utils_1.log.info({
        func: "partners/partners",
        webhook,
        displayName,
        partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
        fee,
    });
    try {
        if (!partner) {
            throw new Error("Partner not found");
        }
        await (0, express_validator_1.check)("webhook", "Webhook url is invalid")
            .optional()
            .isURL()
            .run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            errors.throw();
        }
        if (fee !== undefined && fee < config_1.Config.defaultFee.minFee) {
            throw new Error(`The fee should greater than or equal to ${config_1.Config.defaultFee.minFee}%`);
        }
        await partner.update({
            fee,
            webhook,
            displayName,
        });
        res.status(200).send({
            message: "success",
        });
    }
    catch (error) {
        utils_1.log.info({
            func: "partners",
            webhook,
            displayName,
            partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
        }, "Failed Update Partner");
        if (error.mapped && error.mapped()) {
            return res.status(422).send({
                message: "Failed validation",
                errors: error.mapped(),
            });
        }
        if (error.code) {
            return res.status(400).send(error);
        }
        res.status(400).send({
            message: error.message || "Error",
        });
    }
});
router.patch("/v2/partners/webhook", auth_1.authMiddlewareForPartner, async (req, res) => {
    const partner = req.partner;
    const webhook = req.body.webhook;
    utils_1.log.info({
        func: "partners/webhook",
        webhook,
        partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
    });
    try {
        await (0, express_validator_1.check)("webhook", "Webhook url is required").notEmpty().run(req);
        await (0, express_validator_1.check)("webhook", "Webhook url is invalid").isURL().run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            errors.throw();
        }
        if (!partner) {
            throw new Error("Partner not found");
        }
        await partner.update({
            webhook,
        });
        res.status(200).send({
            message: "success",
        });
    }
    catch (error) {
        if (error.mapped && error.mapped()) {
            return res.status(422).send({
                message: "Failed validation",
                errors: error.mapped(),
            });
        }
        if (error.code) {
            return res.status(400).send(error);
        }
        res.status(400).send({
            message: error.message || "Error",
        });
    }
});
router.post("/v2/partners/orders", auth_1.authMiddlewareForPartner, async (req, res) => {
    const data = req.body;
    const partner = req.partner;
    utils_1.log.info({
        func: "/partners/orders",
        data,
        partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
    }, "Start create partner order");
    try {
        await (0, express_validator_1.check)("phoneNumber", "Phone number is required")
            .notEmpty()
            .run(req);
        await (0, express_validator_1.check)("phoneNumber", "Phone number is invalid")
            .isMobilePhone("en-US")
            .run(req);
        await (0, express_validator_1.check)("amount", "Amount is required").notEmpty().run(req);
        await (0, express_validator_1.check)("amount", "Amount should numeric").isNumeric().run(req);
        await (0, express_validator_1.check)("walletAddress", "Wallet address is required")
            .notEmpty()
            .run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            errors.throw();
        }
        if (!partner.isApproved) {
            throw new Error("Your account is not approved yet. please wait.");
        }
        const checkoutRequest = await CheckoutRequest_1.CheckoutRequest.generateCheckoutRequest({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            streetAddress: data.streetAddress,
            streetAddress2: data.streetAddress2,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            amount: data.amount,
            walletAddress: data.walletAddress,
            partnerOrderId: data.partnerOrderId,
            fee: partner.fee,
            feeType: partner.feeType,
            feeMethod: partner.feeMethod,
            partnerId: partner.id,
        });
        res.status(200).json({
            id: checkoutRequest.id,
            uri: `${config_1.Config.frontendUri}/${checkoutRequest.id}`,
        });
    }
    catch (error) {
        utils_1.log.warn({
            func: "/partners/orders",
            data,
            partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
            err: error,
        }, "Failed create partner order");
        if (error.mapped && error.mapped()) {
            return res.status(422).send({
                message: "Failed validation",
                errors: error.mapped(),
            });
        }
        if (error.code) {
            return res.status(400).send(error);
        }
        res.status(400).send({
            message: error.message || "Error",
        });
    }
});
router.get("/v2/partners/orders", auth_1.authMiddlewareForPartner, async (req, res) => {
    const data = req.query;
    const partner = req.partner;
    utils_1.log.info({
        func: "/partners/orders",
        data,
        partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
    }, "Start get partner orders");
    try {
        await (0, express_validator_1.check)("offset", "Offset is required").notEmpty().run(req);
        await (0, express_validator_1.check)("offset", "Offset is invalid").isInt().run(req);
        await (0, express_validator_1.check)("limit", "Limit is required").notEmpty().run(req);
        await (0, express_validator_1.check)("limit", "Limit is invalid").isInt().run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            errors.throw();
        }
        const status = data.status;
        const offset = data.offset ? Number(data.offset) : 0;
        const limit = Math.min(data.limit ? Number(data.limit) : 10, 50);
        const checkoutRequestCriteria = {
            partnerId: partner.id,
        };
        if (data.status) {
            checkoutRequestCriteria.status = data.status;
        }
        const checkoutRequests = await CheckoutRequest_1.CheckoutRequest.findAndCountAll({
            where: checkoutRequestCriteria,
            include: [
                {
                    model: Checkout_1.Checkout,
                    include: [
                        {
                            model: Charge_1.Charge,
                        },
                        {
                            model: AssetTransfer_1.AssetTransfer,
                        },
                        {
                            model: User_1.User,
                        },
                    ],
                },
            ],
            distinct: true,
            offset,
            limit,
        });
        const rows = checkoutRequests.rows.map((request) => (0, convert_1.normalizeOrder)(request));
        res.status(200).json({
            rows,
            count: checkoutRequests.count,
        });
    }
    catch (error) {
        utils_1.log.warn({
            func: "/partners/orders",
            data,
            partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
            err: error,
        }, "Failed get partner orders");
        if (error.mapped && error.mapped()) {
            return res.status(422).send({
                message: "Failed validation",
                errors: error.mapped(),
            });
        }
        if (error.code) {
            return res.status(400).send(error);
        }
        res.status(400).send({
            message: error.message || "Error",
        });
    }
});
router.get("/v2/partners/orders/:id", auth_1.authMiddlewareForPartner, async (req, res) => {
    const id = req.params.id;
    const partner = req.partner;
    utils_1.log.info({
        func: "/partners/orders/:id",
        id,
        partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
    }, "Start get partner single order");
    try {
        const checkoutRequest = await CheckoutRequest_1.CheckoutRequest.findOne({
            where: {
                partnerId: partner.id,
                id,
            },
            include: [
                {
                    model: Checkout_1.Checkout,
                    include: [
                        {
                            model: Charge_1.Charge,
                        },
                        {
                            model: AssetTransfer_1.AssetTransfer,
                        },
                        {
                            model: User_1.User,
                        },
                    ],
                },
            ],
        });
        res.status(200).json((0, convert_1.normalizeOrder)(checkoutRequest));
    }
    catch (error) {
        utils_1.log.warn({
            func: "/partners/orders/:id",
            id,
            partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
            err: error,
        }, "Failed get partner orders");
        if (error.mapped && error.mapped()) {
            return res.status(422).send({
                message: "Failed validation",
                errors: error.mapped(),
            });
        }
        if (error.code) {
            return res.status(400).send(error);
        }
        res.status(400).send({
            message: error.message || "Error",
        });
    }
});
router.post("/v2/partners/kyb_success/sandbox", auth_1.authMiddlewareForPartner, async (req, res) => {
    const partner = req.partner;
    try {
        if (config_1.Config.isProduction) {
            throw new Error("Not allowed sandbox on production");
        }
        const partnerRecord = await Partner_1.Partner.findByPk(partner.id);
        await partnerRecord.update({
            status: userStatus_type_1.UserStatus.Active,
        });
        const kycLink = await KycLink_1.KycLink.findOne({
            where: {
                userId: partner.id,
            },
        });
        if (kycLink) {
            await kycLink.update({
                kycStatus: userStatus_type_1.UserStatus.Active,
                tosStatus: tosStatus_type_1.TosStatus.Approved,
            });
        }
        await partnerRecord.sendWebhook(partner.id, "account", {
            id: partnerRecord.id,
            firstName: partnerRecord.firstName,
            lastName: partnerRecord.lastName,
            email: partnerRecord.email,
            phoneNumber: partnerRecord.phoneNumber,
            ssn: partnerRecord.ssn,
            dob: partnerRecord.dob,
            status: partnerRecord.status,
            streetAddress: partnerRecord.streetAddress,
            streetAddress2: partnerRecord.streetAddress2,
            city: partnerRecord.city,
            postalCode: partnerRecord.postalCode,
            state: partnerRecord.state,
            country: partnerRecord.country,
        });
        return res.status(200).json({ message: "Approved your account" });
    }
    catch (err) {
        utils_1.log.warn({
            func: "/partners/kyb_success/sandbox",
            err,
        }, "Failed approve KYB");
        if (err.code) {
            return res.status(400).send(err);
        }
        res.status(400).send({
            message: err.message || "Error",
        });
    }
});
router.get("/v2/partners/kyb_link", auth_1.authMiddlewareForPartner, async (req, res) => {
    try {
        const partner = req.partner;
        const kycLink = await KycLink_1.KycLink.findOne({
            where: {
                associatedUserType: "partner",
                userId: partner.id,
            },
        });
        if (!kycLink) {
            throw new Error("Not found kyc link");
        }
        return res.status(200).json({ link: kycLink.kycLink });
    }
    catch (err) {
        utils_1.log.warn({
            func: "/partners/kyb_link",
            err,
        }, "Failed get tos link");
        if (err.mapped && err.mapped()) {
            return res.status(422).send({
                message: "Failed validation",
                errors: err.mapped(),
            });
        }
        res.status(400).send({
            message: err.message || "Error",
        });
    }
});
router.get("/v2/partners/users/:id", auth_1.authMiddlewareForPartner, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User_1.User.findByPk(id);
        if (!user) {
            throw new Error("Not found User");
        }
        return res.status(200).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            dob: user.dob,
            ssn: user.ssn,
            streetAddress: user.streetAddress,
            city: user.city,
            state: user.state,
            postalCode: user.postalCode,
            country: user.country,
            isVerified: user.isVerified,
            status: user.status,
        });
    }
    catch (err) {
        utils_1.log.warn({
            func: "/partners/users/:id",
            err,
        }, "Failed get user");
        res.status(400).send({
            message: err.message || "Error",
        });
    }
});
module.exports = router;
//# sourceMappingURL=partner.js.map