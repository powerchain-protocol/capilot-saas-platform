import { apiRoutes } from "@/config/api";
import type { ApiEnvelope, SecuritySession, ServiceHealth } from "./types";

export class ApiClientError extends Error {
  constructor(message: string, readonly code = "API_ERROR", readonly status = 500) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiFetch<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("accept")) headers.set("accept", "application/json");
  const response = await fetch(input, {
    credentials: "same-origin",
    ...init,
    headers,
  });
  const json = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok || !json?.ok) {
    const failure = json && !json.ok ? json.error : null;
    throw new ApiClientError(failure?.message || `Request failed with HTTP ${response.status}.`, failure?.code || "HTTP_ERROR", response.status);
  }
  return json.data;
}

export const apiV1 = {
  getServices: () => apiFetch<ServiceHealth[]>(apiRoutes.services),
  getSecuritySession: (reveal = false) => apiFetch<SecuritySession>(`${apiRoutes.securitySession}${reveal ? "?reveal=1" : ""}`),
  signOut: () => apiFetch<{ signedOut: boolean }>(apiRoutes.auth.signOut, { method: "POST" }),
};
