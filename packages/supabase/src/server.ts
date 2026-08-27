import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SupabaseServerConfig } from "./config.ts";

export function createPowerChainSupabaseServerClient(config: SupabaseServerConfig): SupabaseClient {
  return createClient(config.url, config.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
