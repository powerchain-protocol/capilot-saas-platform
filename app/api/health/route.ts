import { ok } from "@/lib/server/http";
import { env, hasManagedAi, hasSecureSessionSecret, hasSupabase } from "@/lib/server/env";
export async function GET(){const productionReady=!env.production||(hasSupabase&&hasSecureSessionSecret);return ok({status:productionReady?"operational":"degraded",productionReady,database:hasSupabase?"supabase":env.production?"missing-production-database":"local-development-store",sessions:hasSecureSessionSecret?"configured":"missing-secure-session-secret",ai:hasManagedAi?"managed":"deterministic-demo",timestamp:new Date().toISOString()});}
