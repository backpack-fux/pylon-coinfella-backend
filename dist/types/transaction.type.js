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
exports.TransactionType = void 0;
const type_graphql_1 = require("type-graphql");
const checkoutStep_type_1 = require("./checkoutStep.type");
const paidStatus_type_1 = require("./paidStatus.type");
let TransactionType = class TransactionType {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionType.prototype, "checkoutId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionType.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionType.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionType.prototype, "paidStatus", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionType.prototype, "message", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: null }),
    __metadata("design:type", String)
], TransactionType.prototype, "transactionId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], TransactionType.prototype, "date", void 0);
TransactionType = __decorate([
    (0, type_graphql_1.ObjectType)()
], TransactionType);
exports.TransactionType = TransactionType;
//# sourceMappingURL=transaction.type.js.map