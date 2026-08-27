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
  database: { ok: boolean; adapter: string; latencyMs: number };
  sessions: string;
  ai: string;
  websocket: string;
  providers: { pyth: boolean; birdeye: boolean; helius: boolean; solanaRpc: boolean };
};
