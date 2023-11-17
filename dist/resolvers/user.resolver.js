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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const uuid_1 = require("uuid");
const type_graphql_1 = require("type-graphql");
const utils_1 = require("../utils");
const user_type_1 = require("../types/user.type");
const user_input_type_1 = require("../types/user-input.type");
const User_1 = require("../models/User");
const bridgeService_1 = require("../services/bridgeService");
const AgreementLink_1 = require("../models/AgreementLink");
const KycLink_1 = require("../models/KycLink");
const userService_1 = require("../services/userService");
const config_1 = require("../config");
const userStatus_type_1 = require("../types/userStatus.type");
const tosStatus_type_1 = require("../types/tosStatus.type");
const bridgeService = bridgeService_1.BridgeService.getInstance();
const syncUser = async (user) => {
    const res = await bridgeService.getCustomer(user.id);
    const kycLink = await KycLink_1.KycLink.findOne({
        where: {
            userId: user.id,
        },
    });
    if (kycLink) {
        await kycLink.update({
            kycStatus: res.status,
        });
    }
    await user.update({
        status: res.status,
        requirementsDue: res.requirements_due,
        futureRequirementsDue: res.future_requirements_due,
    });
};
let UserResolver = class UserResolver {
    async me(user) {
        const userRecord = await User_1.User.findByPk(user.id);
        if (!userRecord.isVerified) {
            await syncUser(userRecord);
        }
        return userRecord;
    }
    async user(userId) {
        return User_1.User.findByPk(userId);
    }
    async agreementLink() {
        const idempotenceId = (0, uuid_1.v4)();
        const link = await bridgeService.createTermsOfServiceUrl(idempotenceId);
        await AgreementLink_1.AgreementLink.create({
            id: idempotenceId,
            link,
        });
        return link;
    }
    async createUser(data) {
        utils_1.log.info({
            func: "createUser",
            data,
        });
        const existingUserEmail = await User_1.User.findOne({
            where: {
                email: data.email,
            },
        });
        if (existingUserEmail) {
            throw new Error(`Already exists account with email: ${data.email}`);
        }
        const existingUserPhoneNumber = await User_1.User.findOne({
            where: {
                phoneNumber: data.phoneNumber,
            },
        });
        if (existingUserPhoneNumber) {
            throw new Error(`Already exists account with phone number: ${data.phoneNumber}`);
        }
        const idempotenceId = (0, uuid_1.v4)();
        const res = await bridgeService.createCustomer({
            type: "individual",
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phoneNumber,
            address: {
                street_line_1: data.streetAddress,
                street_line_2: data.streetAddress2,
                city: data.city,
                state: data.state,
                postal_code: data.postalCode,
                country: data.country,
            },
            dob: data.dob,
            ssn: data.ssn,
            signed_agreement_id: data.signedAgreementId,
        }, idempotenceId);
        const user = await User_1.User.create({
            id: res.id,
            status: config_1.Config.isProduction ? res.status : "pending",
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            dob: data.dob,
            ssn: data.ssn,
            password: data.password,
            streetAddress: data.streetAddress,
            streetAddress2: data.streetAddress2,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
            requirementsDue: res.requirements_due,
            futureRequirementsDue: res.future_requirements_due,
            signedAgreementId: data.signedAgreementId,
            idempotenceId,
        });
        const token = user.password
            ? userService_1.UserService.generateJWTToken({
                id: user.id,
                email: user.email,
            })
            : "";
        return {
            ...user.toJSON(),
            isVerified: user.isVerified,
            token,
        };
    }
    async kycLink(user) {
        if (config_1.Config.isProduction) {
            const link = await bridgeService.createKycUrl(user.id, `${config_1.Config.frontendUri}/kyc-success`);
            await KycLink_1.KycLink.create({
                userId: user.id,
                associatedObjectType: "user",
                associatedUserType: "user",
                email: user.email,
                customerId: user.id,
                kycLink: link,
                type: "individual",
                tosStatus: tosStatus_type_1.TosStatus.Approved,
            });
            return link;
        }
        else {
            return `${config_1.Config.frontendUri}/kyc-success`;
        }
    }
    async userKycLink(userId) {
        const user = await User_1.User.findByPk(userId);
        if (!user) {
            throw new Error("Not found user");
        }
        const link = await bridgeService.createKycUrl(user.id, `${config_1.Config.frontendUri}/kyc-success?userId=${userId}`);
        await KycLink_1.KycLink.create({
            userId: user.id,
            associatedObjectType: "user",
            associatedUserType: "user",
            email: user.email,
            customerId: user.id,
            kycLink: link,
            type: "individual",
            tosStatus: tosStatus_type_1.TosStatus.Approved,
        });
        return link;
        // if (Config.isProduction) {
        // } else {
        //   return `${Config.frontendUri}/kyc-success?userId=${userId}`;
        // }
    }
    async kycCompleted(user) {
        const userRecord = await User_1.User.findByPk(user.id);
        if (!config_1.Config.isProduction) {
            await userRecord.update({
                status: userStatus_type_1.UserStatus.Active,
                requirementsDue: [],
                futureRequirementsDue: [],
            });
        }
        else {
            await syncUser(userRecord);
        }
        return true;
    }
    async userKycCompleted(userId) {
        const userRecord = await User_1.User.findByPk(userId);
        if (!config_1.Config.isProduction) {
            await userRecord.update({
                status: userStatus_type_1.UserStatus.Active,
                requirementsDue: [],
                futureRequirementsDue: [],
            });
        }
        else {
            await syncUser(userRecord);
        }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => user_type_1.UserType),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Ctx)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_type_1.UserType, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "agreementLink", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_type_1.UserType),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_input_type_1.UserInputType]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(() => String),
    __param(0, (0, type_graphql_1.Ctx)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "kycLink", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __param(0, (0, type_graphql_1.Arg)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userKycLink", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "kycCompleted", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userKycCompleted", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map