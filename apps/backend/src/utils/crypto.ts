import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { env } from "../config/env";
import type { Role } from "../store/types";

const PASSWORD_KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = cryptoRandomHex(16);
  const hash = scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  const [scheme, salt, expectedHex] = encoded.split(":");
  if (scheme !== "scrypt" || !salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, PASSWORD_KEY_LENGTH);
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function validatePassword(password: string): boolean {
  return password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
}

function cryptoRandomHex(bytes: number): string { return randomBytes(bytes).toString("hex"); }

export type SessionTokenPayload = {
  sid: string;
  userId: string;
  workspaceId: string;
  role: Role;
  exp: number;
  persistent: boolean;
};

function base64url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function secret(): string {
  if (env.sessionSecret.length >= 32) return env.sessionSecret;
  if (env.nodeEnv !== "production") return "powerchain-development-session-secret-change-me";
  throw new Error("SESSION_SECRET is not configured securely.");
}

export function signSessionToken(payload: SessionTokenPayload): string {
  const body = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionTokenPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = createHmac("sha256", secret()).update(body).digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Partial<SessionTokenPayload>;
    if (typeof payload.sid !== "string" || typeof payload.userId !== "string" || typeof payload.workspaceId !== "string") return null;
    if (typeof payload.exp !== "number" || payload.exp <= Date.now()) return null;
    if (!["owner", "admin", "operator", "analyst", "viewer"].includes(String(payload.role))) return null;
    return {
      sid: payload.sid,
      userId: payload.userId,
      workspaceId: payload.workspaceId,
      role: payload.role as Role,
      exp: payload.exp,
      persistent: Boolean(payload.persistent)
    };
  } catch {
    return null;
  }
}
