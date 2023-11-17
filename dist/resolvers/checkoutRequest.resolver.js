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
exports.CheckoutRequestResolver = void 0;
const type_graphql_1 = require("type-graphql");
const checkout_type_1 = require("../types/checkout.type");
const utils_1 = require("../utils");
const CheckoutRequest_1 = require("../models/CheckoutRequest");
const checkoutRequest_type_1 = require("../types/checkoutRequest.type");
const checkoutRequest_input_type_1 = require("../types/checkoutRequest-input.type");
const Checkout_1 = require("../models/Checkout");
const checkout_1 = require("../services/checkout");
const checkoutService = checkout_1.CheckoutService.getInstance();
let CheckoutRequestResolver = class CheckoutRequestResolver {
    async checkoutRequest(id) {
        const checkoutRequest = await CheckoutRequest_1.CheckoutRequest.findByPk(id, {
            include: [{
                    model: Checkout_1.Checkout,
                }]
        });
        if (!checkoutRequest) {
            throw new Error(`Not found checkout request for ${id}`);
        }
        const data = checkoutRequest.toJSON();
        if (checkoutRequest.checkout) {
            const transaction = await checkoutService.getCheckoutStatus(checkoutRequest.checkout);
            data.checkout.transaction = transaction;
        }
        return data;
    }
    async createCheckoutRequest(data) {
        utils_1.log.info({
            func: 'createCheckoutRequest',
            data
        });
        const checkoutRequest = await CheckoutRequest_1.CheckoutRequest.create(data);
        return checkoutRequest;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => checkoutRequest_type_1.CheckoutRequestType),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CheckoutRequestResolver.prototype, "checkoutRequest", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => checkout_type_1.CheckoutType),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checkoutRequest_input_type_1.CheckoutRequestInputType]),
    __metadata("design:returntype", Promise)
], CheckoutRequestResolver.prototype, "createCheckoutRequest", null);
CheckoutRequestResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CheckoutRequestResolver);
exports.CheckoutRequestResolver = CheckoutRequestResolver;
//# sourceMappingURL=checkoutRequest.resolver.js.map