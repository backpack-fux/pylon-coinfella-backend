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
// MODULES
const express = __importStar(require("express"));
const auth_1 = require("../../middleware/auth");
const User_1 = require("../../models/User");
const utils_1 = require("../../utils");
const express_validator_1 = require("express-validator");
const router = express.Router();
router.patch("/v2/users/:id", auth_1.authMiddlewareForPartner, async (req, res) => {
    const partner = req.partner;
    const id = req.params.id;
    const data = req.body;
    utils_1.log.info({
        func: "PATCH: /users/orders",
        partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
        id,
        data,
    }, "Start updating user");
    try {
        const user = await User_1.User.findByPk(id);
        if (!user) {
            throw new Error(`Can\'t find a user for ID: ${id}`);
        }
        await user.update({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            streetAddress: data.streetAddress,
            streetAddress2: data.streetAddress2,
            city: data.city,
            state: data.state,
            ssn: data.ssn,
            dob: data.dob,
        });
        res.status(200).send(user.toJSON());
    }
    catch (error) {
        utils_1.log.info({
            func: "PATCH: /users/orders",
            partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
            id,
            data,
        }, "Failed Update Partner");
        if (error.code) {
            return res.status(400).send(error);
        }
        res.status(400).send({
            message: error.message || "Error",
        });
    }
});
router.get("/v2/users/:id", auth_1.authMiddlewareForPartner, async (req, res) => {
    const partner = req.partner;
    const id = req.params.id;
    utils_1.log.info({
        func: "GET: /users/orders",
        userId: id,
        partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
    }, "Start get partner orders");
    try {
        await (0, express_validator_1.check)("email", "Email is invalid").optional().isEmail().run(req);
        await (0, express_validator_1.check)("phoneNumber", "Phone number is invalid")
            .optional()
            .isMobilePhone("en-US")
            .run(req);
        const user = await User_1.User.findByPk(id);
        if (!user) {
            throw new Error(`Can\'t find a user for ID: ${id}`);
        }
        res.status(200).json(user.toJSON());
    }
    catch (error) {
        utils_1.log.warn({
            func: "GET: /users/orders",
            userId: id,
            partnerId: partner === null || partner === void 0 ? void 0 : partner.id,
            err: error,
        }, "Failed get user");
        if (error.code) {
            return res.status(400).send(error);
        }
        if (error.mapped && error.mapped()) {
            return res.status(422).send({
                message: "Failed validation",
                errors: error.mapped(),
            });
        }
        res.status(400).send({
            message: error.message || "Error",
        });
    }
});
module.exports = router;
//# sourceMappingURL=user.js.map