export const CURRENCY_CODES = ["USD", "EUR", "USDC", "EURC", "SOL", "SUI", "PWRC"] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];
export const DEFAULT_CURRENCY: CurrencyCode = "USD";
export const CRYPTO_DECIMALS: Record<Extract<CurrencyCode, "USDC" | "EURC" | "SOL" | "SUI" | "PWRC">, number> = {
  USDC: 6,
  EURC: 6,
  SOL: 9,
  SUI: 9,
  PWRC: 9,
};
