import { env } from "../../../config/env.ts";
import { SESSION_COOKIE } from "../../../constants/api.ts";

export function parseCookies(header: string | undefined): Record<string, string> {
  const output: Record<string, string> = {};
  for (const segment of (header ?? "").split(";")) {
    const index = segment.indexOf("=");
    if (index < 0) continue;
    const key = segment.slice(0, index).trim();
    const value = segment.slice(index + 1).trim();
    if (key) output[key] = decodeURIComponent(value);
  }
  return output;
}

export function sessionCookieValue(token: string, maxAgeSeconds?: number): string {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Priority=High"
  ];
  if (env.cookieSecure) parts.push("Secure");
  if (env.cookieDomain) parts.push(`Domain=${env.cookieDomain}`);
  if (typeof maxAgeSeconds === "number") parts.push(`Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`);
  return parts.join("; ");
}

export function clearSessionCookieValue(): string {
  return sessionCookieValue("", 0);
}
