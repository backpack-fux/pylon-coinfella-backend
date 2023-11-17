"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CheckoutRequest_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutRequest = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const paidStatus_type_1 = require("../types/paidStatus.type");
const short_uuid_1 = __importDefault(require("short-uuid"));
const Checkout_1 = require("./Checkout");
const Partner_1 = require("./Partner");
const tip_type_1 = require("../types/tip.type");
const feeMethod_enum_1 = require("../types/feeMethod.enum");
let CheckoutRequest = CheckoutRequest_1 = class CheckoutRequest extends sequelize_typescript_1.Model {
    static async generateCheckoutRequest(data) {
        return CheckoutRequest_1.create({
            ...data,
            id: short_uuid_1.default.generate(),
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    (0, sequelize_typescript_1.ForeignKey)(() => Partner_1.Partner),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "partnerId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "partnerOrderId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "walletAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    sequelize_typescript_1.IsEmail,
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "phoneNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "streetAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "streetAddress2", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "city", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(25)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "state", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(10)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "postalCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)("USA"),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)("USD"),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "currency", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2)),
    __metadata("design:type", Number)
], CheckoutRequest.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)("pending"),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("pending", "processing", "paid", "postponed", "error")),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "transactionHash", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2)),
    __metadata("design:type", Number)
], CheckoutRequest.prototype, "fee", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)("percent"),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("cash", "percent")),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "feeType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], CheckoutRequest.prototype, "feeMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], CheckoutRequest.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], CheckoutRequest.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Checkout_1.Checkout),
    __metadata("design:type", Checkout_1.Checkout)
], CheckoutRequest.prototype, "checkout", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Partner_1.Partner),
    __metadata("design:type", Partner_1.Partner)
], CheckoutRequest.prototype, "partner", void 0);
CheckoutRequest = CheckoutRequest_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "checkoutRequests",
        name: {
            singular: "checkoutRequest",
            plural: "checkoutRequests",
        },
    })
], CheckoutRequest);
exports.CheckoutRequest = CheckoutRequest;
//# sourceMappingURL=CheckoutRequest.js.map