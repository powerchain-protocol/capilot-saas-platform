export type PowerChainEnvironment = "development" | "mainnet";
export type SolanaCluster = "devnet" | "mainnet-beta";
export type SuiNetwork = "devnet" | "mainnet";

export type EnvironmentProfile = {
  id: PowerChainEnvironment;
  label: string;
  production: boolean;
  solanaCluster: SolanaCluster;
  suiNetwork: SuiNetwork;
  apiBaseUrl: string;
  appApiBaseUrl: string;
  websocketBaseUrl: string;
  allowRepresentativeData: boolean;
};

export const ENVIRONMENT_PROFILES: Readonly<Record<PowerChainEnvironment, EnvironmentProfile>> = {
  development: {
    id: "development",
    label: "Development",
    production: false,
    solanaCluster: "devnet",
    suiNetwork: "devnet",
    apiBaseUrl: "http://localhost:8000/v1",
    appApiBaseUrl: "http://localhost:3000/api/v1",
    websocketBaseUrl: "ws://localhost:8000",
    allowRepresentativeData: true
  },
  mainnet: {
    id: "mainnet",
    label: "Mainnet",
    production: true,
    solanaCluster: "mainnet-beta",
    suiNetwork: "mainnet",
    apiBaseUrl: "https://api.capilot.powerchain.energy/v1",
    appApiBaseUrl: "https://capilot.powerchain.app/v1",
    websocketBaseUrl: "wss://api.capilot.powerchain.energy",
    allowRepresentativeData: false
  }
} as const;

export function parsePowerChainEnvironment(value: string | undefined): PowerChainEnvironment {
  return value === "mainnet" ? "mainnet" : "development";
}

export function getEnvironmentProfile(value: string | PowerChainEnvironment | undefined): EnvironmentProfile {
  return ENVIRONMENT_PROFILES[parsePowerChainEnvironment(value)];
}
