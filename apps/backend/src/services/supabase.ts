import { readSupabaseServerConfig } from "@powerchain/supabase/config";
import { createPowerChainSupabaseServerClient } from "@powerchain/supabase/server";

let singleton: ReturnType<typeof createPowerChainSupabaseServerClient> | null = null;

export function isSupabaseServerConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
}

export function getSupabaseServerClient() {
  if (singleton) return singleton;
  const config = readSupabaseServerConfig(process.env);
  if (!config) throw new Error("Supabase server integration is not configured.");
  singleton = createPowerChainSupabaseServerClient(config);
  return singleton;
}
