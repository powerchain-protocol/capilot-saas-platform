function csv(value: string | undefined): string[] {
  return (value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
}

export const trustedConfig = {
  origins: Array.from(new Set([...csv(process.env.POWERCHAIN_TRUSTED_ORIGINS), ...csv(process.env.CORS_ALLOWED_ORIGINS)])),
  providerHosts: [
    "api.openai.com",
    "hermes.pyth.network",
    "public-api.birdeye.so",
    "api.devnet.solana.com",
    "api.mainnet-beta.solana.com",
    "api.capilot.powerchain.energy",
    "capilot.powerchain.app"
  ] as const
} as const;

export function isTrustedOrigin(origin: string): boolean {
  return trustedConfig.origins.includes(origin);
}
