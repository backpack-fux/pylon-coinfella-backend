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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetTransfer = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Checkout_1 = require("./Checkout");
const paidStatus_type_1 = require("../types/paidStatus.type");
let AssetTransfer = class AssetTransfer extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AssetTransfer.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Checkout_1.Checkout),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AssetTransfer.prototype, "checkoutId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(paidStatus_type_1.PaidStatus.Pending),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(paidStatus_type_1.PaidStatus))),
    __metadata("design:type", String)
], AssetTransfer.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 6)),
    __metadata("design:type", Number)
], AssetTransfer.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 6)),
    __metadata("design:type", Number)
], AssetTransfer.prototype, "rate", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 6)),
    __metadata("design:type", Number)
], AssetTransfer.prototype, "fee", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], AssetTransfer.prototype, "transactionHash", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], AssetTransfer.prototype, "settledAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], AssetTransfer.prototype, "cancelledAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], AssetTransfer.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], AssetTransfer.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Checkout_1.Checkout),
    __metadata("design:type", Checkout_1.Checkout)
], AssetTransfer.prototype, "checkout", void 0);
AssetTransfer = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'assetTransfers',
        name: {
            singular: 'assetTransfer',
            plural: 'assetTransfers'
        }
    })
], AssetTransfer);
exports.AssetTransfer = AssetTransfer;
//# sourceMappingURL=AssetTransfer.js.map