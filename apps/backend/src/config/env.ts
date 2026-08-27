import { getEnvironmentProfile, parsePowerChainEnvironment, type SolanaCluster, type SuiNetwork } from "@powerchain/shared";

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


function solanaCommitment(value: string | undefined): "processed" | "confirmed" | "finalized" {
  return value === "processed" || value === "finalized" ? value : "confirmed";
}

function sha256List(value: string | undefined): string[] {
  return list(value)
    .map((item) => item.toLowerCase())
    .filter((item) => /^[a-f0-9]{64}$/.test(item));
}

const powerChainEnvironment = parsePowerChainEnvironment(process.env.POWERCHAIN_ENV ?? (process.env.NODE_ENV === "production" ? "mainnet" : "development"));
const environmentProfile = getEnvironmentProfile(powerChainEnvironment);

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  powerChainEnvironment,
  host: process.env.HOST ?? "127.0.0.1",
  port: number(process.env.PORT, 8000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  directDatabaseUrl: process.env.DIRECT_URL ?? "",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "",
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseRealtimeEnabled: bool(process.env.SUPABASE_REALTIME_ENABLED, false),
  sessionSecret: process.env.SESSION_SECRET ?? "",
  corsAllowedOrigins: list(process.env.CORS_ALLOWED_ORIGINS),
  cookieDomain: process.env.COOKIE_DOMAIN ?? "",
  cookieSecure: bool(process.env.COOKIE_SECURE, process.env.NODE_ENV === "production"),
  allowMemoryFallback: bool(process.env.ALLOW_MEMORY_FALLBACK, powerChainEnvironment === "development"),
  allowDemoAi: bool(process.env.ALLOW_DEMO_AI, powerChainEnvironment === "development"),
  allowUnbilledAiPreview: bool(process.env.ALLOW_UNBILLED_AI_PREVIEW, false),
  apiKeyRequired: bool(process.env.API_KEY_REQUIRED, process.env.NODE_ENV === "production"),
  apiKeyHashes: sha256List(process.env.POWERCHAIN_API_KEY_HASHES),
  aiProviderOrder: list(process.env.AI_PROVIDER_ORDER).length ? list(process.env.AI_PROVIDER_ORDER) : ["openai", "anthropic", "gemini", "deepseek", "ollama"],
  aiRequestTimeoutMs: Math.max(5_000, number(process.env.AI_REQUEST_TIMEOUT_MS, 30_000)),
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-5.6-mini",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  anthropicModel: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5",
  anthropicApiUrl: process.env.ANTHROPIC_API_URL ?? "https://api.anthropic.com/v1/messages",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-pro",
  geminiApiUrl: process.env.GEMINI_API_URL ?? "https://generativelanguage.googleapis.com/v1beta/models",
  deepSeekApiKey: process.env.DEEPSEEK_API_KEY ?? "",
  deepSeekModel: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
  deepSeekApiUrl: process.env.DEEPSEEK_API_URL ?? "https://api.deepseek.com/chat/completions",
  ollamaApiUrl: process.env.OLLAMA_API_URL ?? "",
  ollamaModel: process.env.OLLAMA_MODEL ?? "llama3.3",
  solanaCluster: (process.env.SOLANA_CLUSTER ?? environmentProfile.solanaCluster) as SolanaCluster,
  suiNetwork: (process.env.SUI_NETWORK ?? environmentProfile.suiNetwork) as SuiNetwork,
  solanaRpcUrl: process.env.SOLANA_RPC_URL ?? "",
  solanaCommitment: solanaCommitment(process.env.SOLANA_COMMITMENT),
  heliusRpcUrl: process.env.HELIUS_RPC_URL ?? "",
  heliusApiKey: process.env.HELIUS_API_KEY ?? "",
  pythHermesUrl: process.env.PYTH_HERMES_URL ?? "https://hermes.pyth.network",
  birdeyeApiUrl: process.env.BIRDEYE_API_URL ?? "https://public-api.birdeye.so",
  birdeyeApiKey: process.env.BIRDEYE_API_KEY ?? "",
  pwrcMintAddress: process.env.PWRC_MINT_ADDRESS ?? "",
  creditReservationRecoveryMs: Math.max(60_000, number(process.env.CREDIT_RESERVATION_RECOVERY_MS, 15 * 60 * 1000)),
  creditReconcileIntervalMs: Math.max(60_000, number(process.env.CREDIT_RECONCILE_INTERVAL_MS, 60_000))
} as const;

export const isProduction = env.nodeEnv === "production";
export const isMainnet = env.powerChainEnvironment === "mainnet";

export function assertProductionConfiguration(): void {
  if (!isProduction) return;
  if (env.powerChainEnvironment !== "mainnet") throw new Error("POWERCHAIN_ENV must be mainnet when NODE_ENV=production.");
  if (env.solanaCluster !== "mainnet-beta") throw new Error("SOLANA_CLUSTER must be mainnet-beta in production.");
  if (env.suiNetwork !== "mainnet") throw new Error("SUI_NETWORK must be mainnet in production.");
  if (!env.databaseUrl) throw new Error("DATABASE_URL is required in production.");
  if (env.supabaseRealtimeEnabled && (!env.supabaseUrl || !env.supabasePublishableKey)) throw new Error("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are required when SUPABASE_REALTIME_ENABLED=true.");
  if (env.sessionSecret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters in production.");
  if (env.apiKeyRequired && env.apiKeyHashes.length === 0) throw new Error("POWERCHAIN_API_KEY_HASHES must include at least one SHA-256 API key hash in production.");
  if (env.allowMemoryFallback) throw new Error("ALLOW_MEMORY_FALLBACK must be false in production.");
  if (env.allowDemoAi) throw new Error("ALLOW_DEMO_AI must be false in production.");
}
