import { env } from "../config/env";
import { ApiError } from "../api/v1/middlewares/http";

export function solanaRpcUrl(): string {
  if (env.heliusRpcUrl) return env.heliusRpcUrl;
  if (env.heliusApiKey) return `https://mainnet.helius-rpc.com/?api-key=${encodeURIComponent(env.heliusApiKey)}`;
  if (env.solanaRpcUrl) return env.solanaRpcUrl;
  if (env.nodeEnv !== "production") return "https://api.devnet.solana.com";
  throw new ApiError("Solana RPC is not configured.", { status: 503, code: "RPC_NOT_CONFIGURED" });
}

export async function solanaRpc<T>(method: string, params: unknown[] = []): Promise<T> {
  const response = await fetch(solanaRpcUrl(), {
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
  const result = await solanaRpc<string>("getHealth");
  return { status: result === "ok" ? "operational" : "degraded", latencyMs: Date.now() - started, rpc: new URL(solanaRpcUrl()).origin };
}
