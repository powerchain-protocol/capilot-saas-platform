import type { FastifyReply } from "fastify";

export type ApiErrorShape = { message: string; code: string; requestId?: string };
export type ApiEnvelope<T> = { ok: true; data: T } | { ok: false; error: ApiErrorShape };

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(message: string, options: { status?: number; code?: string } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status ?? 500;
    this.code = options.code ?? "INTERNAL_ERROR";
  }
}

export function sendOk<T>(reply: FastifyReply, data: T, status = 200) {
  return reply.code(status).send({ ok: true, data } satisfies ApiEnvelope<T>);
}

export function sendError(reply: FastifyReply, message: string, status = 500, code = "INTERNAL_ERROR", requestId?: string) {
  return reply.code(status).send({ ok: false, error: { message, code, ...(requestId ? { requestId } : {}) } } satisfies ApiEnvelope<never>);
}

export function sanitizeText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, maxLength) : "";
}

export function asBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}
