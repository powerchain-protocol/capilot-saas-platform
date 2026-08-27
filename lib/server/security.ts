import { createHash, randomUUID } from "node:crypto";
import { corsConfig } from "@/config/cors";

type Entry = { count: number; resetAt: number };
type GlobalRate = typeof globalThis & { __pcRateLimit?: Map<string, Entry>; __pcRateLastPrune?: number };
const globalRate = globalThis as GlobalRate;
const buckets = globalRate.__pcRateLimit ?? new Map<string, Entry>();
if (!globalRate.__pcRateLimit) globalRate.__pcRateLimit = buckets;

export function getRequestIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = req.headers.get("x-real-ip")?.trim();
  return forwarded || real || "unavailable";
}

function rateKey(req: Request, namespace: string) {
  const ipHash = createHash("sha256").update(getRequestIp(req)).digest("hex").slice(0, 24);
  return `${namespace}:${ipHash}`;
}

function pruneRateLimits(now: number) {
  const last = globalRate.__pcRateLastPrune ?? 0;
  if (now - last < 60_000) return;
  globalRate.__pcRateLastPrune = now;
  for (const [key, entry] of buckets.entries()) if (entry.resetAt <= now) buckets.delete(key);
}

export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    if (Boolean(host) && new URL(origin).host === host) return true;
    return corsConfig.allowedOrigins.includes(origin);
  } catch {
    return false;
  }
}

export function allowRequest(req: Request, namespace: string, limit: number, windowMs: number) {
  const now = Date.now();
  pruneRateLimits(now);
  const key = rateKey(req, namespace);
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

export function requestId(req?: Request) {
  return req?.headers.get("x-request-id")?.slice(0, 96) || randomUUID();
}

export function securityResponseHeaders(id = requestId()) {
  return {
    "X-Request-ID": id,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  } as const;
}
