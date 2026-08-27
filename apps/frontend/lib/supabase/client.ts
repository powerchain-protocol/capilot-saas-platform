"use client";

import { createPowerChainSupabaseBrowserClient } from "@powerchain/supabase/browser";
import { readSupabasePublicConfig } from "@powerchain/supabase/config";

const config = readSupabasePublicConfig({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

let singleton: ReturnType<typeof createPowerChainSupabaseBrowserClient> | null = null;

export function isSupabaseConfigured(): boolean {
  return config !== null;
}

export function getSupabaseBrowserClient() {
  if (!config) throw new Error("Supabase browser integration is not configured.");
  singleton ??= createPowerChainSupabaseBrowserClient(config);
  return singleton;
}
