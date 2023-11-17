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
exports.CheckoutRequestType = void 0;
const type_graphql_1 = require("type-graphql");
const checkout_type_1 = require("./checkout.type");
let CheckoutRequestType = class CheckoutRequestType {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", Number)
], CheckoutRequestType.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "partnerOrderId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "walletAddress", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "firstName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "lastName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "phoneNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CheckoutRequestType.prototype, "amount", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CheckoutRequestType.prototype, "fee", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "feeType", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CheckoutRequestType.prototype, "feeMethod", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "streetAddress", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "streetAddress2", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "state", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "postalCode", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CheckoutRequestType.prototype, "country", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], CheckoutRequestType.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], CheckoutRequestType.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => checkout_type_1.CheckoutType, { nullable: true, description: "checkout" }),
    __metadata("design:type", checkout_type_1.CheckoutType)
], CheckoutRequestType.prototype, "checkout", void 0);
CheckoutRequestType = __decorate([
    (0, type_graphql_1.ObjectType)()
], CheckoutRequestType);
exports.CheckoutRequestType = CheckoutRequestType;
//# sourceMappingURL=checkoutRequest.type.js.map