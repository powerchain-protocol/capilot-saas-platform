import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { env, hasSecureSessionSecret } from "./env";
import type { Session } from "@/lib/types/domain";

function b64url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export function signSession(session: Session) {
  if (!hasSecureSessionSecret) throw new Error("SESSION_SECRET must be at least 32 characters in production.");
  const payload = b64url(JSON.stringify(session));
  const signature = createHmac("sha256", env.sessionSecret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token?: string | null): Session | null {
  if (!hasSecureSessionSecret) return null;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", env.sessionSecret).update(payload).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    if (!session.exp || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function validatePassword(password: string) {
  return password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}
