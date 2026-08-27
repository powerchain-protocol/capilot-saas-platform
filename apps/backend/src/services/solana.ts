import { env } from "../config/env.ts";
import { ApiError } from "../api/v1/middlewares/http.ts";

export type SolanaRpcProvider = "custom" | "helius" | "public-devnet";
export type SolanaCommitment = typeof env.solanaCommitment;

export type SolanaNetworkSnapshot = {
  network: "solana";
  status: "operational" | "degraded";
  latencyMs: number;
  cluster: typeof env.solanaCluster;
  provider: SolanaRpcProvider;
  commitment: SolanaCommitment;
  slot: number | null;
  blockHeight: number | null;
  genesisHash: string | null;
  version: string | null;
  rpcConfigured: true;
  timestamp: string;
};

export type SolanaAccountSnapshot = {
  address: string;
  cluster: typeof env.solanaCluster;
  commitment: SolanaCommitment;
  exists: boolean;
  balanceLamports: number;
  balanceSol: number;
  owner: string | null;
  executable: boolean | null;
  rentEpoch: number | null;
  contextSlot: number;
};

export type SolanaTransactionSnapshot = {
  signature: string;
  cluster: typeof env.solanaCluster;
  confirmationStatus: "processed" | "confirmed" | "finalized" | null;
  confirmations: number | null;
  slot: number | null;
  err: unknown;
  found: boolean;
};

type RpcEnvelope<T> = { result?: T; error?: { code?: number; message?: string } };
type RpcContextValue<T> = { context: { slot: number }; value: T };

const base58Pattern = /^[1-9A-HJ-NP-Za-km-z]+$/;

function validateBase58(value: string, min: number, max: number, label: string): string {
  const normalized = value.trim();
  if (normalized.length < min || normalized.length > max || !base58Pattern.test(normalized)) {
    throw new ApiError(`Invalid Solana ${label}.`, { status: 422, code: "SOLANA_VALIDATION" });
  }
  return normalized;
}

export function validateSolanaAddress(value: string): string {
  return validateBase58(value, 32, 44, "address");
}

export function validateSolanaSignature(value: string): string {
  return validateBase58(value, 64, 88, "signature");
}

export function solanaRpcConfig(): { url: string; provider: SolanaRpcProvider; cluster: typeof env.solanaCluster; commitment: SolanaCommitment } {
  if (env.solanaRpcUrl) return { url: env.solanaRpcUrl, provider: "custom", cluster: env.solanaCluster, commitment: env.solanaCommitment };
  if (env.heliusRpcUrl) return { url: env.heliusRpcUrl, provider: "helius", cluster: env.solanaCluster, commitment: env.solanaCommitment };
  if (env.heliusApiKey) {
    const host = env.solanaCluster === "mainnet-beta" ? "mainnet.helius-rpc.com" : "devnet.helius-rpc.com";
    return { url: `https://${host}/?api-key=${encodeURIComponent(env.heliusApiKey)}`, provider: "helius", cluster: env.solanaCluster, commitment: env.solanaCommitment };
  }
  if (env.solanaCluster === "devnet") return { url: "https://api.devnet.solana.com", provider: "public-devnet", cluster: "devnet", commitment: env.solanaCommitment };
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
  const payload = await response.json() as RpcEnvelope<T>;
  if (payload.error) throw new ApiError(payload.error.message ?? "Solana RPC error.", { status: 502, code: `RPC_${payload.error.code ?? "ERROR"}` });
  if (payload.result === undefined) throw new ApiError("Solana RPC returned no result.", { status: 502, code: "RPC_EMPTY_RESULT" });
  return payload.result;
}

async function optionalRpc<T>(method: string, params: unknown[] = []): Promise<T | null> {
  try {
    return await solanaRpc<T>(method, params);
  } catch {
    return null;
  }
}

export async function solanaHealth(): Promise<SolanaNetworkSnapshot> {
  const started = Date.now();
  const config = solanaRpcConfig();
  const [health, slot, blockHeight, genesisHash, version] = await Promise.all([
    optionalRpc<string>("getHealth"),
    optionalRpc<number>("getSlot", [{ commitment: config.commitment }]),
    optionalRpc<number>("getBlockHeight", [{ commitment: config.commitment }]),
    optionalRpc<string>("getGenesisHash"),
    optionalRpc<{ "solana-core"?: string }>("getVersion")
  ]);
  const operational = health === "ok" && slot !== null;
  return {
    network: "solana",
    status: operational ? "operational" : "degraded",
    latencyMs: Date.now() - started,
    cluster: config.cluster,
    provider: config.provider,
    commitment: config.commitment,
    slot,
    blockHeight,
    genesisHash,
    version: version?.["solana-core"] ?? null,
    rpcConfigured: true,
    timestamp: new Date().toISOString()
  };
}

export async function solanaAccountSnapshot(input: string): Promise<SolanaAccountSnapshot> {
  const address = validateSolanaAddress(input);
  const config = solanaRpcConfig();
  const options = { commitment: config.commitment };
  const [balance, account] = await Promise.all([
    solanaRpc<RpcContextValue<number>>("getBalance", [address, options]),
    solanaRpc<RpcContextValue<null | { executable: boolean; lamports: number; owner: string; rentEpoch: number }>>("getAccountInfo", [address, { ...options, encoding: "base64" }])
  ]);
  const info = account.value;
  return {
    address,
    cluster: config.cluster,
    commitment: config.commitment,
    exists: info !== null,
    balanceLamports: balance.value,
    balanceSol: balance.value / 1_000_000_000,
    owner: info?.owner ?? null,
    executable: info?.executable ?? null,
    rentEpoch: info?.rentEpoch ?? null,
    contextSlot: Math.max(balance.context.slot, account.context.slot)
  };
}

export async function solanaTransactionSnapshot(input: string): Promise<SolanaTransactionSnapshot> {
  const signature = validateSolanaSignature(input);
  const config = solanaRpcConfig();
  const result = await solanaRpc<RpcContextValue<Array<null | { confirmationStatus?: "processed" | "confirmed" | "finalized"; confirmations: number | null; err: unknown; slot: number }>>>(
    "getSignatureStatuses",
    [[signature], { searchTransactionHistory: true }]
  );
  const status = result.value[0] ?? null;
  return {
    signature,
    cluster: config.cluster,
    confirmationStatus: status?.confirmationStatus ?? null,
    confirmations: status?.confirmations ?? null,
    slot: status?.slot ?? null,
    err: status?.err ?? null,
    found: status !== null
  };
}
