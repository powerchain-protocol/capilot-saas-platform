export const APP_VERSION = "1.0.0" as const;
export const APP_NAME = "PowerChain Copilot" as const;
export const APP_DESCRIPTION =
  "AI infrastructure for renewable operations, energy assets, and governed onchain workflows." as const;

export const runtimeConfig = {
  version: APP_VERSION,
  name: APP_NAME,
  description: APP_DESCRIPTION,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@powerchain.energy",
  dashboardUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "/dashboard",
} as const;
