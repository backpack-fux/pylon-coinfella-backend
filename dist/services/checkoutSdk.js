"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutSdkService = void 0;
const checkout_sdk_node_1 = require("checkout-sdk-node");
const config_1 = require("../config");
const utils_1 = require("../utils");
const cko = new checkout_sdk_node_1.Checkout(config_1.Config.checkoutSecureKey, {
    pk: config_1.Config.checkoutPublicKey,
    environment: config_1.Config.isProduction ? "production" : "sandbox"
});
class CheckoutSdkService {
    static getInstance() {
        return new CheckoutSdkService();
    }
    async charge(checkout) {
        try {
            const checkoutRequest = await checkout.getCheckoutRequest();
            const partner = await (checkoutRequest === null || checkoutRequest === void 0 ? void 0 : checkoutRequest.getPartner());
            const res = await cko.payments.request({
                source: {
                    type: 'token',
                    token: checkout.checkoutTokenId,
                    billing_address: {
                        address_line1: checkout.streetAddress,
                        address_line2: checkout.streetAddress2,
                        city: checkout.city,
                        state: checkout.state,
                        postalCode: checkout.postalCode,
                        country: 'US',
                    },
                },
                currency: checkout.totalChargeAmountMoney.getCurrency(),
                amount: checkout.totalChargeAmountMoney.getAmount(),
                payment_type: 'Regular',
                reference: (partner === null || partner === void 0 ? void 0 : partner.id) || `ORDER ${checkout.id}`,
                description: `Purchase USDC for $${checkout.amount}`,
                processing_channel_id: config_1.Config.checkoutProcessingChannelId,
                customer: {
                    email: checkout.email,
                    name: checkout.fullName,
                },
                metadata: {
                    value: `Purchase USDC for $${checkout.amount}`,
                    checkoutId: checkout.id
                },
            });
            return res;
        }
        catch (err) {
            utils_1.log.warn({
                func: 'CheckoutService.charge',
                checkoutId: checkout.id,
                err
            }, 'Failed charge from checkout.com');
            throw err;
        }
    }
}
exports.CheckoutSdkService = CheckoutSdkService;
//# sourceMappingURL=checkoutSdk.js.map