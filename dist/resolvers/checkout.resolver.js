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
exports.CheckoutResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Checkout_1 = require("../models/Checkout");
const checkout_1 = require("../services/checkout");
const checkout_input_type_1 = require("../types/checkout-input.type");
const checkout_type_1 = require("../types/checkout.type");
const utils_1 = require("../utils");
const User_1 = require("../models/User");
const checkoutService = checkout_1.CheckoutService.getInstance();
let CheckoutResolver = class CheckoutResolver {
    async checkouts() {
        return await Checkout_1.Checkout.findAll();
    }
    async checkout(id) {
        const checkout = await Checkout_1.Checkout.findByPk(id);
        if (!checkout) {
            throw new Error(`Not found checkout for ${id}`);
        }
        const transaction = await checkoutService.getCheckoutStatus(checkout);
        return {
            ...checkout.toJSON(),
            transaction
        };
    }
    async createCheckoutWithoutUser(data) {
        utils_1.log.info({
            func: 'createCheckout',
            data
        });
        const totalAmount = data.amount + data.amount * (data.tip || 0) / 100;
        const user = data.userId && await User_1.User.findByPk(data.userId);
        if (user && !user.isVerified) {
            throw new Error('Please process KYC before trading');
        }
        // modified for a tx to test size limit
        if (totalAmount >= 500 && !user) {
            throw new Error('Required user registration for purchasing over $500');
        }
        return checkoutService.process(data);
    }
    async createCheckout(user, data) {
        utils_1.log.info({
            func: 'createCheckout',
            data,
            user
        });
        if (!user.isVerified) {
            throw new Error('Please process KYC before trading');
        }
        return checkoutService.process(data, user);
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [checkout_type_1.CheckoutType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CheckoutResolver.prototype, "checkouts", null);
__decorate([
    (0, type_graphql_1.Query)(() => checkout_type_1.CheckoutType),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CheckoutResolver.prototype, "checkout", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => checkout_type_1.CheckoutType),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checkout_input_type_1.CheckoutInputType]),
    __metadata("design:returntype", Promise)
], CheckoutResolver.prototype, "createCheckoutWithoutUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => checkout_type_1.CheckoutType),
    __param(0, (0, type_graphql_1.Ctx)('user')),
    __param(1, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkout_input_type_1.CheckoutInputType]),
    __metadata("design:returntype", Promise)
], CheckoutResolver.prototype, "createCheckout", null);
CheckoutResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CheckoutResolver);
exports.CheckoutResolver = CheckoutResolver;
//# sourceMappingURL=checkout.resolver.js.map