import { env } from "../config/env.ts";
import { ApiError } from "../api/v1/middlewares/http.ts";

export type SolanaRpcProvider = "custom" | "helius" | "public-devnet";

export function solanaRpcConfig(): { url: string; provider: SolanaRpcProvider; cluster: typeof env.solanaCluster } {
  if (env.solanaRpcUrl) return { url: env.solanaRpcUrl, provider: "custom", cluster: env.solanaCluster };
  if (env.heliusRpcUrl) return { url: env.heliusRpcUrl, provider: "helius", cluster: env.solanaCluster };
  if (env.heliusApiKey) {
    const host = env.solanaCluster === "mainnet-beta" ? "mainnet.helius-rpc.com" : "devnet.helius-rpc.com";
    return { url: `https://${host}/?api-key=${encodeURIComponent(env.heliusApiKey)}`, provider: "helius", cluster: env.solanaCluster };
  }
  if (env.solanaCluster === "devnet") return { url: "https://api.devnet.solana.com", provider: "public-devnet", cluster: "devnet" };
  throw new ApiError("Solana mainnet RPC is not configured.", { status: 503, code: "RPC_NOT_CONFIGURED" });
}

export function solanaRpcUrl(): string {
  return solanaRpcConfig().url;
}

export async function solanaRpc<T>(method: string, params: unknown[] = []): Promise<T> {
  const config = solanaRpcConfig();
  const response = await fetch(config.url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: "powerchain", method, params }),
    signal: AbortSignal.timeout(10_000)
  });
  if (!response.ok) throw new ApiError(`Solana RPC returned HTTP ${response.status}.`, { status: 502, code: "RPC_HTTP_ERROR" });
  const payload = await response.json() as { result?: T; error?: { code?: number; message?: string } };
  if (payload.error) throw new ApiError(payload.error.message ?? "Solana RPC error.", { status: 502, code: `RPC_${payload.error.code ?? "ERROR"}` });
  if (payload.result === undefined) throw new ApiError("Solana RPC returned no result.", { status: 502, code: "RPC_EMPTY_RESULT" });
  return payload.result;
}

export async function solanaHealth() {
  const started = Date.now();
  const config = solanaRpcConfig();
  const result = await solanaRpc<string>("getHealth");
  return {
    status: result === "ok" ? "operational" : "degraded",
    latencyMs: Date.now() - started,
    cluster: config.cluster,
    provider: config.provider
  };
}
