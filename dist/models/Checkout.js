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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkout = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const paidStatus_type_1 = require("../types/paidStatus.type");
const tip_type_1 = require("../types/tip.type");
const dinero_1 = require("../utils/dinero");
const CheckoutRequest_1 = require("./CheckoutRequest");
const User_1 = require("./User");
const Charge_1 = require("./Charge");
const AssetTransfer_1 = require("./AssetTransfer");
const email_1 = require("../email");
const moment = __importStar(require("moment-timezone"));
const config_1 = require("../config");
const feeMethod_enum_1 = require("../types/feeMethod.enum");
let Checkout = class Checkout extends sequelize_typescript_1.Model {
    //#endregion
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    get zeroMoney() {
        return (0, dinero_1.newDinero)(0, this.currency);
    }
    get amountMoney() {
        return (0, dinero_1.newDinero)(this.amount * 100, this.currency);
    }
    get tipAmountMoney() {
        if (!this.tip) {
            return this.zeroMoney;
        }
        if (this.tipType === tip_type_1.TipType.Cash) {
            return (0, dinero_1.newDinero)(this.tip * 100, this.currency);
        }
        return this.amountMoney.multiply(this.tip / 100);
    }
    get fundsAmountMoney() {
        return this.amountMoney.add(this.tipAmountMoney);
    }
    get feeAmountMoney() {
        if (!this.fee) {
            return this.zeroMoney;
        }
        if (this.feeType === tip_type_1.TipType.Cash) {
            return (0, dinero_1.newDinero)(this.fee * 100, this.currency);
        }
        return this.fundsAmountMoney.multiply(this.fee / 100);
    }
    get totalChargeAmountMoney() {
        if (this.feeMethod === feeMethod_enum_1.FeeMethod.Card) {
            // Card
            return this.fundsAmountMoney.add(this.feeAmountMoney);
        }
        return this.fundsAmountMoney;
    }
    getUSDCFeeMoney(amount) {
        const amountMoney = (0, dinero_1.newDinero)(amount * 100, this.currency);
        if (this.feeMethod === feeMethod_enum_1.FeeMethod.Card) {
            return this.zeroMoney;
        }
        if (this.feeType === tip_type_1.TipType.Cash) {
            (0, dinero_1.newDinero)(this.fee * 100, this.currency);
        }
        return amountMoney.multiply(this.fee / 100);
    }
    getAssetTransferMoney(amount) {
        const amountMoney = (0, dinero_1.newDinero)(amount * 100, this.currency);
        if (this.feeMethod === feeMethod_enum_1.FeeMethod.Card) {
            return amountMoney;
        }
        const feeMoney = this.getUSDCFeeMoney(amount);
        return amountMoney.subtract(feeMoney);
    }
    async sendReceipt() {
        if (!this.email) {
            return;
        }
        const assetTransfer = await this.getAssetTransfer();
        const charge = await this.getCharge();
        const checkoutRequest = await this.getCheckoutRequest();
        const partner = checkoutRequest && (await checkoutRequest.getPartner());
        await email_1.emailService.sendReceiptEmail(this.email, {
            name: this.fullName,
            transactionHash: `${config_1.Config.web3.explorerUri}/tx/${assetTransfer === null || assetTransfer === void 0 ? void 0 : assetTransfer.transactionHash}`,
            paymentMethod: charge.last4,
            dateTime: moment
                .utc((assetTransfer === null || assetTransfer === void 0 ? void 0 : assetTransfer.settledAt) || new Date())
                .format("MMMM Do YYYY, hh:mm"),
            amount: (assetTransfer === null || assetTransfer === void 0 ? void 0 : assetTransfer.amount) || this.fundsAmountMoney.toFormat(),
            fee: this.feeAmountMoney.toUnit(),
            partnerOrderId: checkoutRequest === null || checkoutRequest === void 0 ? void 0 : checkoutRequest.partnerOrderId,
            partnerName: (partner === null || partner === void 0 ? void 0 : partner.displayName) || (partner === null || partner === void 0 ? void 0 : partner.companyName),
            orderLink: (checkoutRequest === null || checkoutRequest === void 0 ? void 0 : checkoutRequest.id)
                ? `${config_1.Config.frontendUri}/${checkoutRequest.id}`
                : undefined,
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Checkout.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => CheckoutRequest_1.CheckoutRequest),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Checkout.prototype, "checkoutRequestId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Checkout.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Checkout.prototype, "walletAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Checkout.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Checkout.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.IsEmail,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Checkout.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Checkout.prototype, "phoneNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)("USD"),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3)),
    __metadata("design:type", String)
], Checkout.prototype, "currency", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2)),
    __metadata("design:type", Number)
], Checkout.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2)),
    __metadata("design:type", Number)
], Checkout.prototype, "tip", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)("percent"),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("cash", "percent")),
    __metadata("design:type", String)
], Checkout.prototype, "tipType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2)),
    __metadata("design:type", Number)
], Checkout.prototype, "fee", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)("cash"),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("cash", "percent")),
    __metadata("design:type", String)
], Checkout.prototype, "feeType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], Checkout.prototype, "feeMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Checkout.prototype, "streetAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Checkout.prototype, "streetAddress2", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Checkout.prototype, "city", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(25)),
    __metadata("design:type", String)
], Checkout.prototype, "state", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(10)),
    __metadata("design:type", String)
], Checkout.prototype, "postalCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Checkout.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Checkout.prototype, "checkoutTokenId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)("pending"),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("pending", "processing", "paid", "postponed", "error")),
    __metadata("design:type", String)
], Checkout.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Checkout.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Checkout.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CheckoutRequest_1.CheckoutRequest),
    __metadata("design:type", CheckoutRequest_1.CheckoutRequest)
], Checkout.prototype, "checkoutRequest", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Checkout.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Charge_1.Charge),
    __metadata("design:type", Charge_1.Charge)
], Checkout.prototype, "charge", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => AssetTransfer_1.AssetTransfer),
    __metadata("design:type", AssetTransfer_1.AssetTransfer)
], Checkout.prototype, "assetTransfer", void 0);
Checkout = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "checkouts",
        name: {
            singular: "checkout",
            plural: "checkouts",
        },
    })
], Checkout);
exports.Checkout = Checkout;
//# sourceMappingURL=Checkout.js.map