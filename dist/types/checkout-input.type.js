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
exports.CheckoutInputType = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const tip_type_1 = require("./tip.type");
let CheckoutInputType = class CheckoutInputType {
};
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "checkoutRequestId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "checkoutTokenId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "walletAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CheckoutInputType.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CheckoutInputType.prototype, "tip", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "tipType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CheckoutInputType.prototype, "fee", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "feeType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CheckoutInputType.prototype, "feeMethod", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "streetAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "streetAddress2", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "postalCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutInputType.prototype, "userId", void 0);
CheckoutInputType = __decorate([
    (0, type_graphql_1.InputType)()
], CheckoutInputType);
exports.CheckoutInputType = CheckoutInputType;
//# sourceMappingURL=checkout-input.type.js.map