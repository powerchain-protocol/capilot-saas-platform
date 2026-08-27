export const servicesConfig = {
  requestTimeoutMs: 6_000,
  cacheTtlMs: 30_000,
  pythHermesUrl: process.env.PYTH_HERMES_URL || "https://hermes.pyth.network",
  birdeyeApiUrl: process.env.BIRDEYE_API_URL || "https://public-api.birdeye.so",
  solanaNetwork: process.env.SOLANA_NETWORK || "devnet",
} as const;
