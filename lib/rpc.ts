import { cacheGetOrSet } from "@/lib/cache";
import { servicesConfig } from "@/config/services";
import { AppError } from "@/utils/errors";

export type SolanaRpcResponse<T> = { jsonrpc: "2.0"; id: string | number; result?: T; error?: { code: number; message: string } };

export function getSolanaRpcUrl() {
  const configured = process.env.SOLANA_RPC_URL || process.env.HELIUS_RPC_URL;
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return "https://api.devnet.solana.com";
  throw new AppError("Solana RPC is not configured for production.", { code: "RPC_NOT_CONFIGURED", status: 503 });
}

export async function solanaRpc<T>(method: string, params: unknown[] = [], options: { url?: string; timeoutMs?: number } = {}) {
  const url = options.url || getSolanaRpcUrl();
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: "powerchain", method, params }),
    signal: AbortSignal.timeout(options.timeoutMs ?? servicesConfig.requestTimeoutMs),
    cache: "no-store",
  });
  if (!response.ok) throw new AppError(`Solana RPC returned HTTP ${response.status}.`, { code: "RPC_HTTP_ERROR", status: 502 });
  const json = await response.json() as SolanaRpcResponse<T>;
  if (json.error) throw new AppError(json.error.message, { code: `RPC_${json.error.code}`, status: 502 });
  if (typeof json.result === "undefined") throw new AppError("Solana RPC returned no result.", { code: "RPC_EMPTY_RESULT", status: 502 });
  return json.result;
}

export async function getSolanaHealth() {
  return cacheGetOrSet("solana:health", 15_000, async () => {
    const started = Date.now();
    const result = await solanaRpc<string>("getHealth");
    return { status: result === "ok" ? "operational" : "degraded", latencyMs: Date.now() - started, network: servicesConfig.solanaNetwork };
  });
}
