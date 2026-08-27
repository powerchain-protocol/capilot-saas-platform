
import { PowerChainSdkError } from "./errors";
import type { ApiEnvelope, AiResponse, Approval, Asset, Chat, HealthSnapshot, Message, SendMessageResponse, ServiceHealth, Session, SessionContext, SessionSecurity } from "./types";

export type PowerChainClientOptions = {
  baseUrl?: string;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  fetch?: typeof fetch;
};

function cleanBaseUrl(value: string): string { return value.replace(/\/+$/, ""); }
function pathSegment(value: string): string { return encodeURIComponent(value); }

export class PowerChainClient {
  readonly baseUrl: string;
  readonly credentials: RequestCredentials;
  readonly defaultHeaders: Headers;
  private readonly fetchImpl: typeof fetch;

  constructor(options: PowerChainClientOptions = {}) {
    this.baseUrl = cleanBaseUrl(options.baseUrl ?? "");
    this.credentials = options.credentials ?? "include";
    this.defaultHeaders = new Headers(options.headers);
    this.fetchImpl = options.fetch ?? fetch;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(this.defaultHeaders);
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    if (!headers.has("accept")) headers.set("accept", "application/json");
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, { ...init, headers, credentials: init.credentials ?? this.credentials, cache: "no-store" });
    const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;
    if (!response.ok || !payload?.ok) {
      const failure = payload && !payload.ok ? payload.error : undefined;
      throw new PowerChainSdkError(failure?.message ?? `Request failed with HTTP ${response.status}.`, failure?.code ?? "HTTP_ERROR", response.status, failure?.requestId);
    }
    return payload.data;
  }

  health(): Promise<HealthSnapshot> { return this.request("/api/v1/health"); }
  demo(): Promise<unknown> { return this.request("/api/v1/auth/demo", { method: "POST" }); }
  signIn(input: { email: string; password: string; rememberMe?: boolean }): Promise<unknown> { return this.request("/api/v1/auth/sign-in", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }); }
  register(input: { name: string; email: string; password: string; workspaceName: string; plan?: "free" | "pro" | "business"; acceptedTerms: true }): Promise<unknown> { return this.request("/api/v1/auth/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }); }
  signOut(): Promise<{ signedOut: boolean }> { return this.request("/api/v1/auth/sign-out", { method: "POST" }); }
  currentSession(): Promise<SessionContext> { return this.request("/api/v1/sessions/current"); }
  listSessions(): Promise<Array<Session & { current: boolean }>> { return this.request("/api/v1/sessions"); }
  revokeSession(id: string): Promise<{ revoked: boolean; id: string }> { return this.request(`/api/v1/sessions/${pathSegment(id)}`, { method: "DELETE" }); }
  sessionSecurity(reveal = false): Promise<SessionSecurity> { return this.request(`/api/v1/security/session?reveal=${reveal ? "1" : "0"}`); }
  dashboard<T = unknown>(): Promise<T> { return this.request("/api/v1/dashboard"); }
  assets(): Promise<Asset[]> { return this.request("/api/v1/assets"); }
  approvals(): Promise<Approval[]> { return this.request("/api/v1/approvals"); }
  updateApproval(id: string, action: "approve" | "request_changes"): Promise<Approval> { return this.request(`/api/v1/approvals/${pathSegment(id)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action }) }); }
  generate(prompt: string): Promise<AiResponse> { return this.request("/api/v1/ai/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt }) }); }
  chats(): Promise<Chat[]> { return this.request("/api/v1/chat"); }
  createChat(title = "New analysis"): Promise<Chat> { return this.request("/api/v1/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title }) }); }
  chat(idOrSlug: string): Promise<{ chat: Chat; messages: Message[] }> { return this.request(`/api/v1/chat/${pathSegment(idOrSlug)}`); }
  sendMessage(idOrSlug: string, message: string): Promise<SendMessageResponse> { return this.request(`/api/v1/chat/${pathSegment(idOrSlug)}/messages`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message }) }); }
  message(id: string): Promise<Message> { return this.request(`/api/v1/messages/${pathSegment(id)}`); }
  services(): Promise<ServiceHealth[]> { return this.request("/api/v1/services"); }
  marketPrice(params: { provider?: "auto" | "pyth" | "birdeye"; feedId?: string; address?: string }): Promise<unknown> {
    const query = new URLSearchParams();
    if (params.provider) query.set("provider", params.provider);
    if (params.feedId) query.set("feedId", params.feedId);
    if (params.address) query.set("address", params.address);
    return this.request(`/api/v1/market/price?${query.toString()}`);
  }
  solanaHealth<T = unknown>(): Promise<T> { return this.request("/api/v1/network/solana"); }
  updateProfile(input: { name: string; workspaceName: string }): Promise<unknown> { return this.request("/api/v1/profile", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }); }
  contact(input: { name: string; email: string; company?: string; message: string; intent?: string }): Promise<unknown> { return this.request("/api/v1/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }); }
}
