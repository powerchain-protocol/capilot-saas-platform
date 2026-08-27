export type TrustedSolanaWallet = {
  id: string;
  publicKey: string;
  purpose: "treasury" | "settlement" | "operations" | "verification";
  network: "mainnet-beta" | "devnet" | "testnet";
};

/** Public addresses only. Never put secret keys, seeds, mnemonics, or signing material in source control. */
export const TRUSTED_SOLANA_WALLETS: readonly TrustedSolanaWallet[] = [];
