
export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: { message: string; code: string; requestId?: string } };
export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;
export type Role = "owner" | "admin" | "operator" | "analyst" | "viewer";
export type Plan = "free" | "pro" | "business";
export type Session = { id: string; userId: string; workspaceId: string; role: Role; persistent: boolean; expiresAt: string; revokedAt: string | null; createdAt: string; lastSeenAt: string };
export type UserSummary = { id: string; name: string; email: string };
export type Workspace = { id: string; name: string; slug: string; plan: Plan; createdAt: string };
export type SessionContext = { session: Session; user: UserSummary; workspace: Workspace; role: Role };
export type Asset = { id: string; workspaceId: string; slug: string; name: string; type: "solar" | "wind" | "storage" | "ev" | "meter"; location: string; capacityMw: number; availability: number; status: "operational" | "attention" | "offline"; verified: boolean };
export type Approval = { id: string; workspaceId: string; slug: string; title: string; description: string; severity: "low" | "medium" | "high"; amount?: string; status: "pending" | "approved" | "changes_requested"; updatedAt: string };
export type Chat = { id: string; workspaceId: string; userId: string; slug: string; title: string; createdAt: string; updatedAt: string };
export type Message = { id: string; chatId: string; workspaceId: string; userId: string; role: "user" | "assistant" | "system"; content: string; createdAt: string };
export type SuggestedAction = { id: string; label: string; href: string };
export type AiResponse = { mode: "managed" | "demo"; text: string; actions: SuggestedAction[] };
export type SendMessageResponse = AiResponse & { chat: Chat; userMessage: Message; message: Message; billing: { quote: CreditQuote; receipt: CreditReceipt; account: CreditAccount } };
export type HealthSnapshot = { status: "operational" | "degraded"; version: string; timestamp: string; database: { ok: boolean; adapter: string; latencyMs: number }; sessions: string; ai: string; websocket: string; providers: { pyth: boolean; birdeye: boolean; helius: boolean; solanaRpc: boolean; supabase?: boolean } };
export type ServiceHealth = { key: string; name: string; category: string; configured: boolean };
export type SessionSecurity = { ip: string; masked: boolean; role: Role; persistent: boolean; expiresAt: string; sessionId: string };
export type ChatSocketEvent = { type: "chat.message" | "chat.receipt" | "chat.updated" | "system.heartbeat"; chatId: string; payload: unknown; timestamp: string };

export type CreditAccount = { id: string; workspaceId: string; userId: string; asset: "PWRC"; decimals: 9; available: string; reserved: string; spent: string; funded: string; updatedAt: string };
export type CreditLedgerEntry = { id: string; accountId: string; workspaceId: string; userId: string; kind: "fund" | "reserve" | "settle" | "release"; amount: string; balanceAfter: string; reference: string; createdAt: string };
export type CreditQuoteStatus = "quoted" | "reserved" | "settled" | "released" | "expired";
export type CreditQuote = { id: string; accountId: string; workspaceId: string; userId: string; chatId: string; requestMessageId: string; responseMessageId: string | null; asset: "PWRC"; amount: string; pricingVersion: "pwrc-message-v1"; canonicalPayload: string; quoteHash: string; status: CreditQuoteStatus; expiresAt: string; createdAt: string; updatedAt: string };
export type CreditReceipt = { id: string; quoteId: string; accountId: string; workspaceId: string; userId: string; chatId: string; responseMessageId: string; quoteHash: string; amount: string; reservationLedgerId: string; settlementLedgerId: string; transferable: false; createdAt: string };
export type CreditsSnapshot = { account: CreditAccount; pricing: { completedResponsePwrc: string; pricingVersion: "pwrc-message-v1" }; lifecycle: readonly ["quote","reserve","deliver","settle","receipt"]; latestReceipt: CreditReceipt | null };
export type TokenDescriptor = { id: string; symbol: string; name: string; network: string; standard: string; decimals: number; mintAddress: string | null; transferFeeBps: number; transferableReceipt: boolean };

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

export type AiProviderStatus = AiModelStatus & { priority: number | null; fallbackEligible: boolean };
export type AiProvidersSnapshot = { environment: "development" | "mainnet"; providerOrder: string[]; fallbackEnabled: boolean; providers: AiProviderStatus[] };

export type SolanaNetworkSnapshot = {
  network: "solana"; status: "operational" | "degraded"; latencyMs: number; cluster: "devnet" | "mainnet-beta";
  provider: "custom" | "helius" | "public-devnet"; commitment: "processed" | "confirmed" | "finalized";
  slot: number | null; blockHeight: number | null; genesisHash: string | null; version: string | null; rpcConfigured: true; timestamp: string;
};
export type SolanaAccountSnapshot = { address: string; cluster: "devnet" | "mainnet-beta"; commitment: "processed" | "confirmed" | "finalized"; exists: boolean; balanceLamports: number; balanceSol: number; owner: string | null; executable: boolean | null; rentEpoch: number | null; contextSlot: number };
export type SolanaTransactionSnapshot = { signature: string; cluster: "devnet" | "mainnet-beta"; confirmationStatus: "processed" | "confirmed" | "finalized" | null; confirmations: number | null; slot: number | null; err: unknown; found: boolean };

export type NetworkProfile = {
  environment: "development" | "mainnet";
  production: boolean;
  solanaCluster: "devnet" | "mainnet-beta";
  solanaCommitment?: "processed" | "confirmed" | "finalized";
  suiNetwork: "devnet" | "mainnet";
  representativeDataAllowed: boolean;
};
