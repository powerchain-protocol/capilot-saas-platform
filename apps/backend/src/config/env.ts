function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function number(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function list(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sha256List(value: string | undefined): string[] {
  return list(value)
    .map((item) => item.toLowerCase())
    .filter((item) => /^[a-f0-9]{64}$/.test(item));
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  host: process.env.HOST ?? "127.0.0.1",
  port: number(process.env.PORT, 8000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  sessionSecret: process.env.SESSION_SECRET ?? "",
  corsAllowedOrigins: list(process.env.CORS_ALLOWED_ORIGINS),
  cookieDomain: process.env.COOKIE_DOMAIN ?? "",
  cookieSecure: bool(process.env.COOKIE_SECURE, process.env.NODE_ENV === "production"),
  allowMemoryFallback: bool(process.env.ALLOW_MEMORY_FALLBACK, process.env.NODE_ENV !== "production"),
  allowDemoAi: bool(process.env.ALLOW_DEMO_AI, process.env.NODE_ENV !== "production"),
  apiKeyRequired: bool(process.env.API_KEY_REQUIRED, process.env.NODE_ENV === "production"),
  apiKeyHashes: sha256List(process.env.POWERCHAIN_API_KEY_HASHES),
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-5.6-mini",
  solanaRpcUrl: process.env.SOLANA_RPC_URL ?? "",
  heliusRpcUrl: process.env.HELIUS_RPC_URL ?? "",
  heliusApiKey: process.env.HELIUS_API_KEY ?? "",
  pythHermesUrl: process.env.PYTH_HERMES_URL ?? "https://hermes.pyth.network",
  birdeyeApiUrl: process.env.BIRDEYE_API_URL ?? "https://public-api.birdeye.so",
  birdeyeApiKey: process.env.BIRDEYE_API_KEY ?? "",
  pwrcMintAddress: process.env.PWRC_MINT_ADDRESS ?? ""
} as const;

export const isProduction = env.nodeEnv === "production";

export function assertProductionConfiguration(): void {
  if (!isProduction) return;
  if (!env.databaseUrl) throw new Error("DATABASE_URL is required in production.");
  if (env.sessionSecret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters in production.");
  if (env.apiKeyRequired && env.apiKeyHashes.length === 0) throw new Error("POWERCHAIN_API_KEY_HASHES must include at least one SHA-256 API key hash in production.");
}
