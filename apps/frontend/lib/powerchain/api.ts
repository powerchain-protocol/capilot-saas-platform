import { withQuery } from "@/queries/queries";
import { endpoints } from "./endpoints";
import type { ApiEnvelope, ApiMessage, ChatSummary, HealthSnapshot, SecuritySession, ServiceHealth, SessionContext } from "./types";
import type { CreditsSnapshot, CreditLedgerEntry, CreditQuote, CreditReceipt } from "@/types/credits";
import type { TokenDescriptor } from "@/types/tokens";

export class PowerChainApiError extends Error {
  constructor(message: string, readonly code = "API_ERROR", readonly status = 500, readonly requestId?: string) {
    super(message);
    this.name = "PowerChainApiError";
  }
}

export async function apiFetch<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("accept")) headers.set("accept", "application/json");
  const response = await fetch(input, {
    credentials: "same-origin",
    cache: "no-store",
    ...init,
    headers,
  });
  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok || !payload?.ok) {
    const failure = payload && !payload.ok ? payload.error : null;
    throw new PowerChainApiError(
      failure?.message || `Request failed with HTTP ${response.status}.`,
      failure?.code || "HTTP_ERROR",
      response.status,
      failure?.requestId,
    );
  }
  return payload.data;
}

export const powerChainApi = {
  health: () => apiFetch<HealthSnapshot>(endpoints.health),
  getServices: () => apiFetch<ServiceHealth[]>(endpoints.services),
  getCredits: () => apiFetch<CreditsSnapshot>(endpoints.credits),
  getCreditLedger: () => apiFetch<CreditLedgerEntry[]>(endpoints.creditLedger),
  getCreditQuotes: () => apiFetch<CreditQuote[]>(endpoints.creditQuotes),
  getCreditReceipts: () => apiFetch<CreditReceipt[]>(endpoints.creditReceipts),
  getTokens: () => apiFetch<TokenDescriptor[]>(endpoints.tokens),
  getPwrcToken: () => apiFetch<TokenDescriptor>(endpoints.pwrcToken),
  getSecuritySession: (reveal = false) => apiFetch<SecuritySession>(withQuery(endpoints.securitySession, { reveal: reveal ? 1 : undefined })),
  currentSession: () => apiFetch<SessionContext>(endpoints.sessions.current),
  listSessions: () => apiFetch<Array<SessionContext["session"] & { current: boolean }>>(endpoints.sessions.list),
  revokeSession: (id: string) => apiFetch<{ revoked: boolean; id: string }>(endpoints.sessions.revoke(id), { method: "DELETE" }),
  signOut: () => apiFetch<{ signedOut: boolean }>(endpoints.auth.signOut, { method: "POST" }),
  listChats: () => apiFetch<ChatSummary[]>(endpoints.chat.list),
  createChat: (title = "New analysis") => apiFetch<ChatSummary>(endpoints.chat.list, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title }),
  }),
  getChat: (idOrSlug: string) => apiFetch<{ chat: ChatSummary; messages: ApiMessage[] }>(endpoints.chat.byId(idOrSlug)),
  sendChatMessage: (idOrSlug: string, message: string) => apiFetch<{ chat: ChatSummary; userMessage: ApiMessage; message: ApiMessage; mode: "managed" | "demo"; text: string; actions: Array<{ id: string; label: string; href: string }>; billing: { quote: CreditQuote; receipt: CreditReceipt; account: CreditsSnapshot["account"] } }>(endpoints.chat.messages(idOrSlug), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message }),
  }),
  getMessage: (id: string) => apiFetch<ApiMessage>(endpoints.message(id)),
};
