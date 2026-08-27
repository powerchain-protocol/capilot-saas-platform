import { env } from "../config/env.ts";
import { APP_VERSION } from "../constants/api.ts";
import { aiRuntimeModels } from "../services/ai.ts";
import { getStore } from "../store/index.ts";

export type HealthSnapshot = {
  status: "operational" | "degraded";
  version: string;
  timestamp: string;
  environment: "development" | "mainnet";
  networks: { solana: "devnet" | "mainnet-beta"; sui: "devnet" | "mainnet" };
  database: { ok: boolean; adapter: string; latencyMs: number };
  sessions: "configured" | "development-secret";
  ai: "managed" | "deterministic-demo" | "unavailable";
  aiProvidersConfigured: number;
  websocket: "enabled";
  providers: { pyth: boolean; birdeye: boolean; helius: boolean; solanaRpc: boolean; supabase: boolean };
};

export async function collectHealth(): Promise<HealthSnapshot> {
  let database: HealthSnapshot["database"];
  try {
    database = await getStore().health();
  } catch {
    database = { ok: false, adapter: "unavailable", latencyMs: 0 };
  }
  const sessions = env.sessionSecret.length >= 32 ? "configured" : "development-secret";
  const aiProvidersConfigured = aiRuntimeModels().filter((model) => model.configured).length;
  const ai = aiProvidersConfigured > 0 ? "managed" : env.allowDemoAi ? "deterministic-demo" : "unavailable";
  const status = database.ok && ai !== "unavailable" ? "operational" : "degraded";
  return {
    status,
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    environment: env.powerChainEnvironment,
    networks: { solana: env.solanaCluster, sui: env.suiNetwork },
    database,
    sessions,
    ai,
    aiProvidersConfigured,
    websocket: "enabled",
    providers: {
      pyth: Boolean(env.pythHermesUrl),
      birdeye: Boolean(env.birdeyeApiKey),
      helius: Boolean(env.heliusRpcUrl || env.heliusApiKey),
      solanaRpc: Boolean(env.solanaRpcUrl || env.heliusRpcUrl || env.heliusApiKey || env.solanaCluster === "devnet"),
      supabase: Boolean(env.supabaseUrl && (env.supabaseSecretKey || env.supabasePublishableKey))
    }
  };
}
