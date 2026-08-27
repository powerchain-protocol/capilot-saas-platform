export type SolanaAiContext = {
  cluster: "mainnet-beta" | "devnet" | "testnet";
  wallet?: string;
  signature?: string;
};

export function solanaSafetyContext(context: SolanaAiContext): string {
  const wallet = context.wallet ? `wallet ${context.wallet}` : "no wallet selected";
  return `Solana ${context.cluster}; ${wallet}. Treat balances, signatures, and settlement as unverified until confirmed by the configured RPC/evidence layer.`;
}
