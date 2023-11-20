"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
exports.Config = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpires: 24,
    checkoutPublicKey: process.env.CHECKOUT_PUBLIC_KEY,
    checkoutSecureKey: process.env.CHECKOUT_SECURE_KEY,
    checkoutProcessingChannelId: process.env.CHECKOUT_PROCESSING_CHANNEL_ID,
    bridgeApiKey: process.env.BRIDGE_API_KEY,
    bridgeApiURI: process.env.BRIDGE_API_URI,
    isProduction: process.env.NODE_ENV === "production",
    isStaging: process.env.NODE_ENV === "staging",
    subscriptionUri: process.env.SUBSCRIPTION_URI,
    frontendUri: process.env.FRONT_END_URI || "https://test.checkout.mybackpack.app",
    defaultFee: {
        minFee: 4.5,
        fee: 6.5,
        feeType: "percent",
    },
    web3: {
        providerUri: process.env.ALCHEMY_URI,
        usdcContractAddress: process.env.USDC_CONTRACT_ADDRESS,
        usdcPoolPrivateKey: process.env.USDC_POOL_PRIVATE_KEY,
        explorerUri: process.env.EXPLORER_URI,
    },
};
//# sourceMappingURL=index.js.map