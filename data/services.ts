export type ServiceKey = "pyth" | "birdeye" | "helius" | "solana-rpc";

export const serviceCatalog: Array<{
  key: ServiceKey;
  name: string;
  category: string;
  description: string;
}> = [
  { key: "pyth", name: "Pyth", category: "Oracle", description: "Configurable price-feed adapter with short-lived server caching." },
  { key: "birdeye", name: "Birdeye", category: "Market data", description: "Optional Solana token market-data provider with authenticated server requests." },
  { key: "helius", name: "Helius", category: "Solana infrastructure", description: "Optional production RPC and Solana infrastructure provider." },
  { key: "solana-rpc", name: "Solana RPC", category: "Network", description: "Fail-closed RPC adapter with development-only devnet fallback." },
];
