"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const config_1 = require("../config");
const bluebird_1 = __importDefault(require("bluebird"));
const Charge_1 = require("../models/Charge");
const Checkout_1 = require("../models/Checkout");
const checkoutSdk_1 = require("./checkoutSdk");
const utils_1 = require("../utils");
const convert_1 = require("../utils/convert");
const paidStatus_type_1 = require("../types/paidStatus.type");
const checkoutStep_type_1 = require("../types/checkoutStep.type");
const notificationService_1 = require("./notificationService");
const CheckoutRequest_1 = require("../models/CheckoutRequest");
const exchange_1 = require("../utils/exchange");
const AssetTransfer_1 = require("../models/AssetTransfer");
const web3Service_1 = require("./web3Service");
const settingService_1 = require("./settingService");
const checkoutSdkService = checkoutSdk_1.CheckoutSdkService.getInstance();
const notificationService = notificationService_1.NotificationService.getInstance();
const web3Service = web3Service_1.Web3Service.getInstance();
const settingsService = settingService_1.SettingService.getInstance();
class CheckoutService {
    static getInstance() {
        return new CheckoutService(checkoutSdkService, notificationService);
    }
    constructor(checkoutSdk, notification) {
        this.checkoutSdk = checkoutSdk;
        this.notification = notification;
    }
    async process(data, user) {
        if (data.checkoutRequestId) {
            const checkoutRequest = await CheckoutRequest_1.CheckoutRequest.findByPk(data.checkoutRequestId);
            if (!checkoutRequest) {
                throw new Error("Can't find checkout request");
            }
            if (checkoutRequest.walletAddress !== data.walletAddress) {
                throw new Error("Mismatch wallet address");
            }
            if (checkoutRequest.phoneNumber !== data.phoneNumber) {
                throw new Error("Mismatch phone number");
            }
            if (checkoutRequest.email && checkoutRequest.email !== data.email) {
                throw new Error("Mismatch email address");
            }
            if (Number(checkoutRequest.amount) !== Number(data.amount)) {
                throw new Error("Mismatch amount");
            }
            if (data.fee && Number(checkoutRequest.fee) !== Number(data.fee)) {
                throw new Error("Mismatch fee");
            }
            if (data.feeType && checkoutRequest.feeType !== data.feeType) {
                throw new Error("Mismatch fee type");
            }
            if (checkoutRequest.feeMethod !== data.feeMethod) {
                throw new Error("Mismatch fee method");
            }
        }
        const checkout = await Checkout_1.Checkout.create({
            ...data,
            userId: user === null || user === void 0 ? void 0 : user.id,
            fee: data.fee || config_1.Config.defaultFee.fee,
            feeType: (data.feeType || config_1.Config.defaultFee.feeType),
        });
        return checkout;
    }
    async markAsCheckout(checkout, status) {
        await checkout.update({
            status,
        });
        const checkoutRequest = await checkout.getCheckoutRequest();
        await (checkoutRequest === null || checkoutRequest === void 0 ? void 0 : checkoutRequest.update({
            status,
        }));
        const partner = await (checkoutRequest === null || checkoutRequest === void 0 ? void 0 : checkoutRequest.getPartner());
        if (!partner) {
            return;
        }
        const charge = await checkout.getCharge();
        const assetTransfer = await checkout.getAssetTransfer();
        const user = await checkout.getUser();
        await partner.sendWebhook(checkoutRequest.partnerOrderId, "order", {
            id: checkoutRequest.id,
            walletAddress: checkoutRequest.walletAddress,
            email: checkoutRequest.email,
            phoneNumber: checkoutRequest.phoneNumber,
            status: checkoutRequest.status,
            partnerOrderId: checkoutRequest.partnerOrderId,
            transactionHash: assetTransfer === null || assetTransfer === void 0 ? void 0 : assetTransfer.transactionHash,
            feeAmount: checkout.feeAmountMoney.toUnit(),
            tipAmount: checkout.tipAmountMoney.toUnit(),
            chargeAmount: checkout.totalChargeAmountMoney.toUnit(),
            unitAmount: assetTransfer === null || assetTransfer === void 0 ? void 0 : assetTransfer.amount,
            chargeId: charge === null || charge === void 0 ? void 0 : charge.id,
            chargeCode: charge === null || charge === void 0 ? void 0 : charge.code,
            chargeMsg: charge === null || charge === void 0 ? void 0 : charge.message,
            chargeStatus: charge === null || charge === void 0 ? void 0 : charge.status,
            last4: charge === null || charge === void 0 ? void 0 : charge.last4,
            customer: {
                id: user === null || user === void 0 ? void 0 : user.id,
                firstName: (user === null || user === void 0 ? void 0 : user.firstName) || checkout.firstName,
                lastName: (user === null || user === void 0 ? void 0 : user.lastName) || checkout.lastName,
                email: (user === null || user === void 0 ? void 0 : user.email) || checkout.email,
                phoneNumber: (user === null || user === void 0 ? void 0 : user.phoneNumber) || checkout.phoneNumber,
                ssn: user === null || user === void 0 ? void 0 : user.ssn,
                dob: user === null || user === void 0 ? void 0 : user.dob,
                status: user === null || user === void 0 ? void 0 : user.status,
                streetAddress: (user === null || user === void 0 ? void 0 : user.streetAddress) || checkout.streetAddress,
                streetAddress2: (user === null || user === void 0 ? void 0 : user.streetAddress2) || checkout.streetAddress2,
                city: (user === null || user === void 0 ? void 0 : user.city) || checkout.city,
                postalCode: (user === null || user === void 0 ? void 0 : user.postalCode) || checkout.postalCode,
                state: (user === null || user === void 0 ? void 0 : user.state) || checkout.state,
                country: (user === null || user === void 0 ? void 0 : user.country) || checkout.country,
            },
        });
    }
    async processCharge(checkout) {
        try {
            await this.notification.publishTransactionStatus({
                checkoutId: checkout.id,
                step: checkoutStep_type_1.CheckoutStep.Charge,
                status: "processing",
                paidStatus: checkout.status,
                message: `Processing charge $${checkout.totalChargeAmountMoney.toUnit()}`,
                transactionId: null,
                date: new Date(),
            });
            const charge = await this.checkoutSdk.charge(checkout);
            const chargeData = (0, convert_1.convertToCharge)(charge);
            const chargeRecord = await Charge_1.Charge.create({
                checkoutId: checkout.id,
                ...chargeData,
            });
            if (chargeRecord.status !== "Authorized") {
                const message = chargeRecord.message
                    ? `${chargeRecord.code}: ${chargeRecord.message}`
                    : `Failed Charge $${checkout.totalChargeAmountMoney.toUnit()} with ${chargeRecord.status}`;
                throw new Error(message);
            }
            await this.notification.publishTransactionStatus({
                checkoutId: checkout.id,
                step: checkoutStep_type_1.CheckoutStep.Charge,
                status: "settled",
                paidStatus: checkout.status,
                message: `Charged $${checkout.totalChargeAmountMoney.toUnit()}`,
                transactionId: null,
                date: new Date(),
            });
        }
        catch (err) {
            utils_1.log.warn({
                func: "processCharge",
                checkoutId: checkout.id,
                err,
            }, "Failed processCharge");
            await this.markAsCheckout(checkout, paidStatus_type_1.PaidStatus.Error);
            await this.notification.publishTransactionStatus({
                checkoutId: checkout.id,
                status: "failed",
                paidStatus: checkout.status,
                step: checkoutStep_type_1.CheckoutStep.Charge,
                message: err.message,
                transactionId: null,
                date: new Date(),
            });
            throw err;
        }
    }
    async processCheckout(checkout) {
        await bluebird_1.default.delay(2000);
        try {
            await this.markAsCheckout(checkout, paidStatus_type_1.PaidStatus.Processing);
            await this.processCharge(checkout);
            const isEnabledAssetTransfer = await settingsService.getSetting("assetTransfer");
            if (!isEnabledAssetTransfer) {
                await this.markAsCheckout(checkout, paidStatus_type_1.PaidStatus.Paid);
                await this.notification.publishTransactionStatus({
                    checkoutId: checkout.id,
                    step: checkoutStep_type_1.CheckoutStep.Charge,
                    status: "charged",
                    paidStatus: checkout.status,
                    transactionId: "",
                    message: `Charged ${checkout.totalChargeAmountMoney.toUnit()}`,
                    date: new Date(),
                });
                checkout.sendReceipt();
            }
            else {
                await this.markAsCheckout(checkout, paidStatus_type_1.PaidStatus.Processing);
                await this.processTransferAsset(checkout);
            }
        }
        catch (err) {
            utils_1.log.warn({
                func: "processCheckout",
                checkoutId: checkout.id,
                err,
            });
        }
    }
    async processTransferAsset(checkout) {
        let assetTransfer;
        try {
            const rate = await (0, exchange_1.getUSDCRate)();
            const amount = Number((checkout.fundsAmountMoney.toUnit() / rate).toFixed(6));
            const assetTransfer = await AssetTransfer_1.AssetTransfer.create({
                checkoutId: checkout.id,
                status: paidStatus_type_1.PaidStatus.Processing,
                rate,
                amount,
                fee: 0,
            });
            await this.notification.publishTransactionStatus({
                checkoutId: checkout.id,
                step: checkoutStep_type_1.CheckoutStep.Asset,
                status: "processing",
                paidStatus: checkout.status,
                message: `Sending ${assetTransfer.amount} USDC`,
                transactionId: null,
                date: new Date(),
            });
            const sendingAmount = config_1.Config.isProduction ? assetTransfer.amount : 0.1;
            const receipt = await web3Service.send(checkout.walletAddress, sendingAmount);
            await assetTransfer.update({
                transactionHash: receipt.transactionHash,
                status: receipt.status ? paidStatus_type_1.PaidStatus.Paid : paidStatus_type_1.PaidStatus.Error,
                settledAt: receipt.status ? new Date() : undefined,
            });
            const checkoutRequest = await checkout.getCheckoutRequest();
            if (checkoutRequest) {
                await checkoutRequest.update({
                    transactionHash: receipt.transactionHash,
                });
            }
            if (!receipt.status) {
                throw new Error(`Failed sending ${assetTransfer.amount} USDC`);
            }
            await this.markAsCheckout(checkout, paidStatus_type_1.PaidStatus.Paid);
            await this.notification.publishTransactionStatus({
                checkoutId: checkout.id,
                step: checkoutStep_type_1.CheckoutStep.Asset,
                status: "settled",
                paidStatus: checkout.status,
                transactionId: receipt.transactionHash,
                message: `Sent ${assetTransfer.amount} USDC`,
                date: new Date(),
            });
            await checkout.sendReceipt();
        }
        catch (err) {
            utils_1.log.warn({
                func: "processTransferAsset",
                checkoutId: checkout.id,
                err,
            }, "Failed processTransferAsset");
            assetTransfer &&
                (await assetTransfer.update({
                    status: paidStatus_type_1.PaidStatus.Error,
                }));
            await this.markAsCheckout(checkout, paidStatus_type_1.PaidStatus.Error);
            await this.notification.publishTransactionStatus({
                checkoutId: checkout.id,
                status: "failed",
                paidStatus: checkout.status,
                step: checkoutStep_type_1.CheckoutStep.Asset,
                message: assetTransfer
                    ? `Failed sending ${assetTransfer.amount} USDC`
                    : "Failed sending assets",
                transactionId: null,
                date: new Date(),
            });
            throw err;
        }
    }
    async getCheckoutStatus(checkout) {
        const transaction = {
            checkoutId: checkout.id,
            step: checkoutStep_type_1.CheckoutStep.Charge,
            status: checkout.status === paidStatus_type_1.PaidStatus.Paid
                ? "settled"
                : checkout.status === paidStatus_type_1.PaidStatus.Error
                    ? "failed"
                    : checkout.status,
            paidStatus: checkout.status,
            message: "",
            transactionId: null,
            date: new Date(),
        };
        const charge = await checkout.getCharge();
        const assetTransfer = await checkout.getAssetTransfer();
        if (assetTransfer) {
            transaction.step = checkoutStep_type_1.CheckoutStep.Asset;
        }
        else if (charge) {
            transaction.step = checkoutStep_type_1.CheckoutStep.Charge;
        }
        if (checkout.status === paidStatus_type_1.PaidStatus.Paid) {
            transaction.message = `Charged ${checkout.totalChargeAmountMoney.toFormat()}`;
        }
        if (checkout.status === paidStatus_type_1.PaidStatus.Paid && assetTransfer) {
            transaction.transactionId = assetTransfer === null || assetTransfer === void 0 ? void 0 : assetTransfer.transactionHash;
            transaction.message = "Settled transfer assets";
        }
        else if (checkout.status === paidStatus_type_1.PaidStatus.Processing) {
            transaction.message = `Processing ${transaction.step}`;
        }
        else if (transaction.paidStatus === paidStatus_type_1.PaidStatus.Error) {
            transaction.message = (charge === null || charge === void 0 ? void 0 : charge.code)
                ? `${charge.code}: ${charge.message}`
                : `Failed checkout for ${transaction.step}`;
        }
        return transaction;
    }
}
exports.CheckoutService = CheckoutService;
//# sourceMappingURL=checkout.js.map