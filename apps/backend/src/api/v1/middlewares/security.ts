import { createHash, timingSafeEqual } from "node:crypto";
import type { FastifyRequest } from "fastify";
import { env } from "../../../config/env.ts";
import { API_KEY_HEADER } from "../../../constants/api.ts";
import { ApiError } from "./http.ts";

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

function digestApiKey(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

function digestHex(value: string): Buffer | null {
  if (!/^[a-f0-9]{64}$/i.test(value)) return null;
  return Buffer.from(value, "hex");
}

export function hasValidApiKey(request: FastifyRequest): boolean {
  if (!env.apiKeyRequired && env.apiKeyHashes.length === 0) return true;
  const raw = request.headers[API_KEY_HEADER];
  const supplied = Array.isArray(raw) ? raw[0] : raw;
  if (typeof supplied !== "string" || supplied.length < 16 || supplied.length > 512) return false;
  const candidate = digestApiKey(supplied);
  for (const configured of env.apiKeyHashes) {
    const expected = digestHex(configured);
    if (expected && expected.length === candidate.length && timingSafeEqual(candidate, expected)) return true;
  }
  return false;
}

export function requireApiKey(request: FastifyRequest): void {
  if (!hasValidApiKey(request)) {
    throw new ApiError("A valid PowerChain API key is required.", { status: 401, code: "INVALID_API_KEY" });
  }
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
