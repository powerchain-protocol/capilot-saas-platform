export const UI_RULES = {
  minTouchTargetPx: 44,
  mobileBreakpointPx: 768,
  tabletBreakpointPx: 1024,
  maxContentWidthPx: 1440,
  reducedMotionSafe: true,
  lazyLoadNonCriticalMarketingSections: true,
} as const;

export const INSTALL_RULES = {
  allowedSources: ["github", "drive", "store", "web"] as const,
  nativePlatforms: ["macOS", "Windows", "iOS", "Android"] as const,
  requireSignedNativeBuilds: true,
  allowUnsignedNativeBuilds: false,
  failClosedWhenSourceMissing: true,
} as const;

export const SECURITY_RULES = {
  requireProductionSessionSecret: true,
  requireProductionDurableStore: true,
  noPrivateKeyCustody: true,
  sensitiveActionsRequireExplicitApproval: true,
  standardSessionHours: 12,
  rememberedSessionDays: 30,
  rawIpPersistedByReferenceApp: false,
  providerSecretsServerOnly: true,
  externalProviderTimeoutMs: 6_000,
} as const;

export const API_RULES = {
  version: "v1",
  basePath: "/api/v1",
  corsDefault: "same-origin",
  cacheProviderDataMs: 30_000,
  failClosedOnMissingProductionRpc: true,
} as const;

export type InstallSource = (typeof INSTALL_RULES.allowedSources)[number];
export type NativePlatform = (typeof INSTALL_RULES.nativePlatforms)[number];

export function isAllowedInstallSource(value: string): value is InstallSource {
  return INSTALL_RULES.allowedSources.includes(value as InstallSource);
}

export function isNativePlatform(value: string): value is NativePlatform {
  return INSTALL_RULES.nativePlatforms.includes(value as NativePlatform);
}
