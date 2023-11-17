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
exports.UserInputType = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
let UserInputType = class UserInputType {
};
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UserInputType.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "ssn", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "streetAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UserInputType.prototype, "streetAddress2", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "postalCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInputType.prototype, "signedAgreementId", void 0);
UserInputType = __decorate([
    (0, type_graphql_1.InputType)()
], UserInputType);
exports.UserInputType = UserInputType;
//# sourceMappingURL=user-input.type.js.map