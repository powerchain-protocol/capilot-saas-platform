import { createHash, randomUUID } from "node:crypto";
import type { FastifyRequest } from "fastify";

export type RequestContext = {
  requestId: string;
  ip: string;
  ipHash: string;
  userAgent: string;
  startedAt: number;
};

function firstForwarded(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0]?.split(",")[0]?.trim() ?? "unavailable";
  return value?.split(",")[0]?.trim() ?? "unavailable";
}

export function getRequestIp(request: FastifyRequest): string {
  const forwarded = firstForwarded(request.headers["x-forwarded-for"]);
  if (forwarded !== "unavailable") return forwarded;
  const real = firstForwarded(request.headers["x-real-ip"]);
  if (real !== "unavailable") return real;
  return request.ip || "unavailable";
}

export function createRequestContext(request: FastifyRequest): RequestContext {
  const ip = getRequestIp(request);
  return {
    requestId: String(request.headers["x-request-id"] ?? randomUUID()).slice(0, 96),
    ip,
    ipHash: createHash("sha256").update(ip).digest("hex").slice(0, 24),
    userAgent: String(request.headers["user-agent"] ?? "unknown").slice(0, 512),
    startedAt: Date.now()
  };
}

export function maskIp(ip: string): string {
  if (ip.includes(":")) {
    const parts = ip.split(":").filter(Boolean);
    return parts.length > 2 ? `${parts.slice(0, 2).join(":")}:…` : "IPv6";
  }
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.x.x`;
  return "unavailable";
}
