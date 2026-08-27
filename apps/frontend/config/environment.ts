import { getEnvironmentProfile, type PowerChainEnvironment, type SolanaCluster, type SuiNetwork } from "@powerchain/shared";

const requestedEnvironment = (process.env.NEXT_PUBLIC_POWERCHAIN_ENV ?? "development") as PowerChainEnvironment;
const profile = getEnvironmentProfile(requestedEnvironment);

export const frontendEnvironment = {
  ...profile,
  solanaCluster: (process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? profile.solanaCluster) as SolanaCluster,
  suiNetwork: (process.env.NEXT_PUBLIC_SUI_NETWORK ?? profile.suiNetwork) as SuiNetwork,
  apiBaseUrl: process.env.NEXT_PUBLIC_POWERCHAIN_API_URL ?? profile.apiBaseUrl,
  appApiBaseUrl: process.env.NEXT_PUBLIC_POWERCHAIN_APP_API_URL ?? profile.appApiBaseUrl,
  websocketBaseUrl: process.env.NEXT_PUBLIC_POWERCHAIN_WS_URL ?? profile.websocketBaseUrl
} as const;
