export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: { message: string; code: string; requestId?: string } };
export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export type Role = "owner" | "admin" | "operator" | "analyst" | "viewer";
export type SessionContext = {
  session: {
    id: string;
    userId: string;
    workspaceId: string;
    role: Role;
    persistent: boolean;
    expiresAt: string;
    revokedAt: string | null;
    createdAt: string;
    lastSeenAt: string;
  };
  user: { id: string; name: string; email: string };
  workspace: { id: string; name: string; slug: string; plan: "free" | "pro" | "business"; createdAt: string };
  role: Role;
};

export type ServiceHealth = {
  key: string;
  name: string;
  category: string;
  configured: boolean;
};

export type SecuritySession = {
  ip: string;
  masked: boolean;
  role: Role;
  persistent: boolean;
  expiresAt: string;
  sessionId: string;
};

export type ChatSummary = {
  id: string;
  workspaceId: string;
  userId: string;
  slug: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiMessage = {
  id: string;
  chatId: string;
  workspaceId: string;
  userId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};


export type HealthSnapshot = {
  status: "operational" | "degraded";
  version: string;
  timestamp: string;
  environment?: "development" | "mainnet";
  networks?: { solana: "devnet" | "mainnet-beta"; sui: "devnet" | "mainnet" };
  database: { ok: boolean; adapter: string; latencyMs: number };
  sessions: string;
  ai: string;
  aiProvidersConfigured?: number;
  websocket: string;
  providers: { pyth: boolean; birdeye: boolean; helius: boolean; solanaRpc: boolean; supabase?: boolean };
};

export type AiModelStatus = {
  provider: "openai" | "anthropic" | "gemini" | "deepseek" | "ollama";
  model: string;
  configured: boolean;
  local: boolean;
};

export type AiModelsSnapshot = {
  environment: "development" | "mainnet";
  providerOrder: string[];
  models: AiModelStatus[];
};

export type AiProviderStatus = AiModelStatus & {
  priority: number | null;
  fallbackEligible: boolean;
};

export type AiProvidersSnapshot = {
  environment: "development" | "mainnet";
  providerOrder: string[];
  fallbackEnabled: boolean;
  providers: AiProviderStatus[];
};

export type SolanaNetworkSnapshot = {
  network: "solana";
  status: "operational" | "degraded";
  latencyMs: number;
  cluster: "devnet" | "mainnet-beta";
  provider: "custom" | "helius" | "public-devnet";
  commitment: "processed" | "confirmed" | "finalized";
  slot: number | null;
  blockHeight: number | null;
  genesisHash: string | null;
  version: string | null;
  rpcConfigured: true;
  timestamp: string;
};

export type SolanaAccountSnapshot = {
  address: string;
  cluster: "devnet" | "mainnet-beta";
  commitment: "processed" | "confirmed" | "finalized";
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
  cluster: "devnet" | "mainnet-beta";
  confirmationStatus: "processed" | "confirmed" | "finalized" | null;
  confirmations: number | null;
  slot: number | null;
  err: unknown;
  found: boolean;
};

export type NetworkProfile = {
  environment: "development" | "mainnet";
  production: boolean;
  solanaCluster: "devnet" | "mainnet-beta";
  solanaCommitment?: "processed" | "confirmed" | "finalized";
  suiNetwork: "devnet" | "mainnet";
  representativeDataAllowed: boolean;
};
