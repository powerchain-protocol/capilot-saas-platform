import { cacheGetOrSet } from "@/lib/cache";
import { solanaRpc } from "@/lib/rpc";
import { servicesConfig } from "@/config/services";
import { AppError } from "@/utils/errors";

export function isHeliusConfigured() {
  return Boolean(process.env.HELIUS_RPC_URL || process.env.HELIUS_API_KEY);
}

export function getHeliusRpcUrl() {
  if (process.env.HELIUS_RPC_URL) return process.env.HELIUS_RPC_URL;
  if (process.env.HELIUS_API_KEY) return `https://mainnet.helius-rpc.com/?api-key=${encodeURIComponent(process.env.HELIUS_API_KEY)}`;
  throw new AppError("Helius is not configured.", { code: "HELIUS_NOT_CONFIGURED", status: 503 });
}

export async function getHeliusHealth() {
  return cacheGetOrSet("helius:health", 15_000, async () => {
    const started = Date.now();
    const result = await solanaRpc<string>("getHealth", [], { url: getHeliusRpcUrl(), timeoutMs: servicesConfig.requestTimeoutMs });
    return { status: result === "ok" ? "operational" : "degraded", latencyMs: Date.now() - started, source: "helius" as const };
  });
}
