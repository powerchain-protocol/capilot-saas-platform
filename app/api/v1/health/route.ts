import { withCors, corsPreflight } from "@/cors";
import { ok } from "@/lib/server/http";
import { env, hasManagedAi, hasSecureSessionSecret, hasSupabase } from "@/lib/server/env";
import { isPythConfigured } from "@/lib/pyth";
import { isBirdeyeConfigured } from "@/lib/birdeye";
import { isHeliusConfigured } from "@/lib/helius";
import { APP_VERSION } from "@/config/app";

export async function GET(req: Request) {
  const productionReady = !env.production || (hasSupabase && hasSecureSessionSecret);
  return withCors(req, ok({
    status: productionReady ? "operational" : "degraded",
    version: APP_VERSION,
    productionReady,
    database: hasSupabase ? "supabase" : env.production ? "missing-production-database" : "local-development-store",
    sessions: hasSecureSessionSecret ? "configured" : "missing-secure-session-secret",
    ai: hasManagedAi ? "managed" : "deterministic-demo",
    services: { pyth: isPythConfigured(), birdeye: isBirdeyeConfigured(), helius: isHeliusConfigured() },
    timestamp: new Date().toISOString(),
  }));
}
export function OPTIONS(req: Request) { return corsPreflight(req); }
