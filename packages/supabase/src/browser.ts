import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SupabasePublicConfig } from "./config.ts";

export function createPowerChainSupabaseBrowserClient(config: SupabasePublicConfig): SupabaseClient {
  return createClient(config.url, config.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    realtime: { params: { eventsPerSecond: 10 } },
  });
}
