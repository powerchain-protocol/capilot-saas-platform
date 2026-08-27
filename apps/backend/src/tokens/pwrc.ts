import { env } from "../config/env";

export const PWRC_TOKEN = {
  id: "pwrc",
  symbol: "PWRC",
  name: "PowerChain",
  network: "solana",
  standard: "Token-2022",
  decimals: 9,
  mintAddress: env.pwrcMintAddress || null,
  transferFeeBps: 200,
  transferableReceipt: false
} as const;

export const SUPPORTED_TOKENS = [PWRC_TOKEN] as const;
