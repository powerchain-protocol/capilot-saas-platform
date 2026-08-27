export type ExplorerKey = "solscan" | "solana-explorer" | "suiscan" | "suivision";

export type ExplorerDefinition = {
  key: ExplorerKey;
  label: string;
  network: "solana" | "sui";
  transactionUrl: (signature: string, cluster?: string) => string;
};

export const EXPLORERS: Record<ExplorerKey, ExplorerDefinition> = {
  solscan: {
    key: "solscan",
    label: "Solscan",
    network: "solana",
    transactionUrl: (signature, cluster = "mainnet") => `https://solscan.io/tx/${encodeURIComponent(signature)}${cluster === "mainnet" ? "" : `?cluster=${encodeURIComponent(cluster)}`}`
  },
  "solana-explorer": {
    key: "solana-explorer",
    label: "Solana Explorer",
    network: "solana",
    transactionUrl: (signature, cluster = "mainnet-beta") => `https://explorer.solana.com/tx/${encodeURIComponent(signature)}?cluster=${encodeURIComponent(cluster)}`
  },
  suiscan: {
    key: "suiscan",
    label: "Suiscan",
    network: "sui",
    transactionUrl: (digest, network = "mainnet") => `https://suiscan.xyz/${encodeURIComponent(network)}/tx/${encodeURIComponent(digest)}`
  },
  suivision: {
    key: "suivision",
    label: "SuiVision",
    network: "sui",
    transactionUrl: (digest, network = "mainnet") => `https://suivision.xyz/txblock/${encodeURIComponent(digest)}?network=${encodeURIComponent(network)}`
  }
};
