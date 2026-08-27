import { withCors, corsPreflight } from "@/cors";
import { getHeliusHealth, isHeliusConfigured } from "@/lib/helius";
import { getSolanaHealth } from "@/lib/rpc";
import { safeAction } from "@/lib/safe-actions";
import { apiSession, fail, ok } from "@/lib/server/http";
import { allowRequest } from "@/lib/server/security";

export async function GET(req: Request) {
  if (!allowRequest(req, "v1-solana-health", 60, 60_000)) return withCors(req, fail("Too many requests. Try again shortly.", 429, "RATE_LIMITED"));
  const session = await apiSession();
  if (!session) return withCors(req, fail("Sign in required.", 401, "UNAUTHENTICATED"));
  const result = await safeAction(() => isHeliusConfigured() ? getHeliusHealth() : getSolanaHealth(), "Unable to reach the configured Solana RPC.");
  return withCors(req, result.ok ? ok(result.data) : fail(result.error.message, result.error.status, result.error.code));
}
export function OPTIONS(req: Request) { return corsPreflight(req); }
