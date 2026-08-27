import { createHash } from "node:crypto";
import type { FastifyRequest } from "fastify";
import { env } from "../../../config/env";

export function sameOriginOrAllowed(request: FastifyRequest): boolean {
  const originHeader = request.headers.origin;
  if (!originHeader) return true;
  const origin = String(originHeader);
  const host = String(request.headers["x-forwarded-host"] ?? request.headers.host ?? "");
  try {
    if (host && new URL(origin).host === host) return true;
  } catch {
    return false;
  }
  return env.corsAllowedOrigins.includes(origin);
}

type RateEntry = { count: number; resetAt: number };
const buckets = new Map<string, RateEntry>();
let lastPrune = 0;

function prune(now: number): void {
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const [key, entry] of buckets.entries()) if (entry.resetAt <= now) buckets.delete(key);
}

export function rateLimit(request: FastifyRequest, namespace: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  prune(now);
  const ip = request.ip || String(request.headers["x-forwarded-for"] ?? "unknown");
  const key = `${namespace}:${createHash("sha256").update(ip).digest("hex").slice(0, 20)}`;
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
