export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
};

export type SupabaseServerConfig = {
  url: string;
  secretKey: string;
};

type EnvSource = Readonly<Record<string, string | undefined>>;

function clean(value: string | undefined): string {
  return value?.trim() ?? "";
}

function validUrl(value: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.hostname === "127.0.0.1" || url.hostname === "localhost";
  } catch {
    return false;
  }
}

export function readSupabasePublicConfig(env: EnvSource): SupabasePublicConfig | null {
  const url = clean(env.NEXT_PUBLIC_SUPABASE_URL) || clean(env.SUPABASE_URL);
  const publishableKey = clean(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || clean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || clean(env.SUPABASE_PUBLISHABLE_KEY) || clean(env.SUPABASE_ANON_KEY);
  if (!url && !publishableKey) return null;
  if (!validUrl(url)) throw new Error("Supabase URL must be an HTTPS URL (localhost is allowed for development).");
  if (!publishableKey) throw new Error("Supabase publishable key is missing.");
  return { url, publishableKey };
}

export function readSupabaseServerConfig(env: EnvSource): SupabaseServerConfig | null {
  const url = clean(env.SUPABASE_URL) || clean(env.NEXT_PUBLIC_SUPABASE_URL);
  const secretKey = clean(env.SUPABASE_SECRET_KEY) || clean(env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url && !secretKey) return null;
  if (!validUrl(url)) throw new Error("SUPABASE_URL must be an HTTPS URL (localhost is allowed for development).");
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is required for privileged Supabase server operations.");
  return { url, secretKey };
}
