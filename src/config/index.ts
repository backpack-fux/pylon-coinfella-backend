export const Config = {
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
  discordUri: process.env.DISCORD_URI,
  frontendUri: process.env.FRONT_END_URI || "https://test.checkout.mybackpack.app",
  defaultFee: {
    minFee: 3.5,
    fee: 3.5,
    feeType: "percent"
  },
  web3: {
    providerUri: process.env.ALCHEMY_URI,
    usdcContractAddress: process.env.USDC_CONTRACT_ADDRESS,
    usdcPoolPrivateKey: process.env.USDC_POOL_PRIVATE_KEY,
    explorerUri: process.env.EXPLORER_URI
  }
};
