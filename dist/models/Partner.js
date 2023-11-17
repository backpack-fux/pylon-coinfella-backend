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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Partner = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const userService_1 = require("../services/userService");
const userStatus_type_1 = require("../types/userStatus.type");
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
const tip_type_1 = require("../types/tip.type");
const feeMethod_enum_1 = require("../types/feeMethod.enum");
let Partner = class Partner extends sequelize_typescript_1.Model {
    //#region Associations
    get isApproved() {
        return this.status === userStatus_type_1.UserStatus.Active;
    }
    get name() {
        return `${this.firstName} ${this.lastName}`;
    }
    //#endregion
    static async beforeSaveHook(partner, options) {
        if (partner.password && partner.changed("password")) {
            const hashedPw = await userService_1.UserService.encryptPassword(partner.password);
            partner.password = hashedPw;
        }
    }
    static async findPartner(email, password) {
        const partner = await this.findOne({
            where: { email },
        });
        if (!partner || partner.password == null || partner.password.length === 0) {
            throw new Error("Invalid email or password");
        }
        const isPasswordMatch = await userService_1.UserService.comparePassword(password, partner.password);
        if (!isPasswordMatch) {
            throw new Error("Invalid email or password");
        }
        return partner;
    }
    async sendWebhook(id, type, data) {
        if (!(this === null || this === void 0 ? void 0 : this.webhook)) {
            return;
        }
        try {
            await axios_1.default.post(this.webhook, {
                id,
                type,
                accountId: this.id,
                data,
            });
        }
        catch (err) {
            utils_1.log.warn({
                func: "partner.sendWebhook",
                accountId: this.id,
                data,
                id,
                type,
                err,
            }, "Failed send webhook");
        }
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Partner.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(userStatus_type_1.UserStatus.Pending),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(userStatus_type_1.UserStatus))),
    __metadata("design:type", String)
], Partner.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Partner.prototype, "companyName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Partner.prototype, "displayName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Partner.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Partner.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.IsEmail,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Partner.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Partner.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Partner.prototype, "phoneNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Partner.prototype, "ssn", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], Partner.prototype, "dob", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Partner.prototype, "streetAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Partner.prototype, "streetAddress2", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Partner.prototype, "city", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(25)),
    __metadata("design:type", String)
], Partner.prototype, "state", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(10)),
    __metadata("design:type", String)
], Partner.prototype, "postalCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Partner.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2)),
    __metadata("design:type", Number)
], Partner.prototype, "fee", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)("percent"),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("cash", "percent")),
    __metadata("design:type", String)
], Partner.prototype, "feeType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], Partner.prototype, "feeMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Partner.prototype, "webhook", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Partner.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Partner.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Partner, Object]),
    __metadata("design:returntype", Promise)
], Partner, "beforeSaveHook", null);
Partner = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "partners",
        name: {
            singular: "partner",
            plural: "partners",
        },
    })
], Partner);
exports.Partner = Partner;
//# sourceMappingURL=Partner.js.map