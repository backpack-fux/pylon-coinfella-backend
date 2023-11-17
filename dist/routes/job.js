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
const checkout_1 = require("../services/checkout");
const Checkout_1 = require("../models/Checkout");
const paidStatus_type_1 = require("../types/paidStatus.type");
const utils_1 = require("../utils");
const kycService_1 = require("../services/kycService");
const checkoutService = checkout_1.CheckoutService.getInstance();
const kycService = kycService_1.KycService.getInstance();
const router = express.Router();
router.post("/jobs/processCheckoutWorker", async (req, res) => {
    try {
        const checkouts = await Checkout_1.Checkout.findAll({
            where: {
                status: paidStatus_type_1.PaidStatus.Pending,
            },
        });
        const result = {
            success: [],
            failed: [],
        };
        for (const checkout of checkouts) {
            try {
                await checkoutService.processCheckout(checkout);
                result.success.push(checkout.id);
            }
            catch (err) {
                utils_1.log.warn({
                    func: "/jobs/processCheckoutWorker",
                    checkoutId: checkout.id,
                }, "Failed process checkout");
                result.failed.push(checkout.id);
            }
        }
        utils_1.log.info({
            func: "/jobs/processCheckoutWorker",
            result,
        }, "Checkout Info");
        return res.status(200).json({
            result,
        });
    }
    catch (err) {
        utils_1.log.warn({
            func: "/jobs/processCheckoutWorker",
            err,
        }, "failed sync");
        res.status(400).send({
            message: err.message || "Error",
        });
    }
});
router.post("/jobs/kyc10MinutesWorker", async (req, res) => {
    try {
        await kycService.syncKycIn10Minutes();
        return res.status(200).json({
            message: "synced",
        });
    }
    catch (err) {
        utils_1.log.warn({
            func: "/jobs/kyc10MinutesWorker",
            err,
        }, "failed sync");
        res.status(400).send({
            message: err.message || "Error",
        });
    }
});
router.post("/jobs/syncKycInAnHour", async (req, res) => {
    try {
        await kycService.syncKycInAnHour();
        return res.status(200).json({
            message: "synced",
        });
    }
    catch (err) {
        utils_1.log.warn({
            func: "/jobs/syncKycInAnHour",
            err,
        }, "failed sync");
        res.status(400).send({
            message: err.message || "Error",
        });
    }
});
router.post("/jobs/syncKycIn2Days", async (req, res) => {
    try {
        await kycService.syncKycIn2Days();
        return res.status(200).json({
            message: "synced",
        });
    }
    catch (err) {
        utils_1.log.warn({
            func: "/jobs/syncKycIn2Days",
            err,
        }, "failed sync");
        res.status(400).send({
            message: err.message || "Error",
        });
    }
});
router.post("/jobs/syncKycIn10Days", async (req, res) => {
    try {
        await kycService.syncKycIn10Days();
        return res.status(200).json({
            message: "synced",
        });
    }
    catch (err) {
        utils_1.log.warn({
            func: "/jobs/syncKycIn10Days",
            err,
        }, "failed sync");
        res.status(400).send({
            message: err.message || "Error",
        });
    }
});
module.exports = router;
//# sourceMappingURL=job.js.map