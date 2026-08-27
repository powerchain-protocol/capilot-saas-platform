import { serviceCatalog } from "@/data/services";
import { apiSession, fail, ok } from "@/lib/server/http";
import { allowRequest } from "@/lib/server/security";
import { isPythConfigured } from "@/lib/pyth";
import { isBirdeyeConfigured } from "@/lib/birdeye";
import { isHeliusConfigured } from "@/lib/helius";
import { withCors, corsPreflight } from "@/cors";

export async function GET(req: Request) {
  if (!allowRequest(req, "v1-services", 120, 60_000)) return withCors(req, fail("Too many requests. Try again shortly.", 429, "RATE_LIMITED"));
  const session = await apiSession();
  if (!session) return withCors(req, fail("Sign in required.", 401, "UNAUTHENTICATED"));
  const configured = { pyth: isPythConfigured(), birdeye: isBirdeyeConfigured(), helius: isHeliusConfigured(), "solana-rpc": Boolean(process.env.SOLANA_RPC_URL || process.env.HELIUS_RPC_URL || process.env.NODE_ENV !== "production") };
  return withCors(req, ok(serviceCatalog.map((service) => ({ ...service, configured: configured[service.key] }))));
}
export function OPTIONS(req: Request) { return corsPreflight(req); }
