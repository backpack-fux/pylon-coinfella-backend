import { Checkout as CheckoutSdk } from "checkout-sdk-node";
import { Config } from "../config";
import { Checkout } from "../models/Checkout";
import { log } from "../utils";

const cko = new CheckoutSdk(Config.checkoutSecureKey, {
  pk: Config.checkoutPublicKey,
  environment: Config.isProduction ? "production" : "sandbox",
});

export class CheckoutSdkService {
  static getInstance() {
    return new CheckoutSdkService();
  }

  async charge(checkout: Checkout) {
    try {
      const checkoutRequest = await checkout.getCheckoutRequest();
      const partner = await checkoutRequest?.getPartner();

      const res = await cko.payments.request({
        source: {
          type: "token",
          token: checkout.checkoutTokenId,
          billing_address: {
            address_line1: checkout.streetAddress,
            address_line2: checkout.streetAddress2,
            city: checkout.city,
            state: checkout.state,
            zip: checkout.postalCode,
            country: "US",
          },
        },
        processing: {
          aft: true,
        },
        recipient: {
          first_name: checkout.firstName,
          last_name: checkout.lastName,
          account_name: checkout.phoneNumber,
          address: {
            address_line1: checkout.streetAddress,
            address_line2: checkout.streetAddress2,
            city: checkout.city,
            state: checkout.state,
            zip: checkout.postalCode,
            country: "US",
          },
        },
        sender: {
          type: "individual",
          first_name: checkout.firstName,
          last_name: checkout.lastName,
          address: {
            address_line1: checkout.streetAddress,
            address_line2: checkout.streetAddress2,
            city: checkout.city,
            state: checkout.state,
            zip: checkout.postalCode,
            country: "US",
          },
        },
        currency: checkout.totalChargeAmountMoney.getCurrency(),
        amount: checkout.totalChargeAmountMoney.getAmount(),
        payment_type: "Regular",
        reference: partner?.id || `ORDER ${checkout.id}`,
        description: `Purchase USDC for $${checkout.amount}`,
        processing_channel_id: Config.checkoutProcessingChannelId,
        customer: {
          email: checkout.email,
          name: checkout.fullName,
        },
        metadata: {
          value: `Purchase USDC for $${checkout.amount}`,
          checkoutId: checkout.id,
        },
      });

      return res as any;
    } catch (err) {
      log.warn(
        {
          func: "CheckoutService.charge",
          checkoutId: checkout.id,
          err,
        },
        "Failed charge from checkout.com"
      );
      throw err;
    }
  }
}
