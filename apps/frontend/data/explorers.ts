export type ExplorerDefinition = {
  key: "solscan" | "solana-explorer" | "suiscan" | "suivision";
  name: string;
  network: "solana" | "sui";
  transactionBaseUrl: string;
};

export const explorers: readonly ExplorerDefinition[] = [
  { key: "solscan", name: "Solscan", network: "solana", transactionBaseUrl: "https://solscan.io/tx/" },
  { key: "solana-explorer", name: "Solana Explorer", network: "solana", transactionBaseUrl: "https://explorer.solana.com/tx/" },
  { key: "suiscan", name: "Suiscan", network: "sui", transactionBaseUrl: "https://suiscan.xyz/mainnet/tx/" },
  { key: "suivision", name: "SuiVision", network: "sui", transactionBaseUrl: "https://suivision.xyz/txblock/" },
] as const;

export function explorerTransactionUrl(key: ExplorerDefinition["key"], transactionId: string): string | null {
  const explorer = explorers.find((item) => item.key === key);
  return explorer ? `${explorer.transactionBaseUrl}${encodeURIComponent(transactionId)}` : null;
}
