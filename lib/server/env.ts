const nodeEnv = process.env.NODE_ENV || "development";
const production = nodeEnv === "production";
const configuredSessionSecret = process.env.SESSION_SECRET || "";

export const env = {
  sessionSecret: configuredSessionSecret || (production ? "" : "powerchain-local-development-secret-change-me"),
  supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  openAiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  nodeEnv,
  production,
};

export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseServiceKey);
export const hasManagedAi = Boolean(env.openAiKey && env.openAiModel);
export const hasSecureSessionSecret = env.sessionSecret.length >= 32;

export function assertDurablePersistence(){
  if(env.production && !hasSupabase) throw new Error("Production persistence is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
}
