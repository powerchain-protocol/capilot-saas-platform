import { withCors, corsPreflight } from "@/cors";
import { getSession } from "@/lib/server/auth";
import { allowRequest, getRequestIp } from "@/lib/server/security";
import { fail, ok } from "@/lib/server/http";
import { maskIp } from "@/utils/helpers";

export async function GET(req: Request) {
  if (!allowRequest(req, "v1-session-security", 120, 60_000)) return withCors(req, fail("Too many requests. Try again shortly.", 429, "RATE_LIMITED"));
  const session = await getSession();
  if (!session) return withCors(req, fail("Sign in required.", 401, "UNAUTHENTICATED"));
  const reveal = new URL(req.url).searchParams.get("reveal") === "1";
  const ip = getRequestIp(req);
  return withCors(req, ok({
    ip: reveal ? ip : maskIp(ip),
    masked: !reveal,
    role: session.role,
    persistent: Boolean(session.persistent),
    expiresAt: new Date(session.exp).toISOString(),
  }));
}
export function OPTIONS(req: Request) { return corsPreflight(req); }
