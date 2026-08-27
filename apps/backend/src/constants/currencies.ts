export type CurrencyCode = "USD" | "EUR" | "USDC" | "EURC" | "SOL" | "SUI" | "PWRC";

export type CurrencyDefinition = {
  code: CurrencyCode;
  name: string;
  decimals: number;
  kind: "fiat" | "stablecoin" | "native" | "utility";
};

export const CURRENCIES: readonly CurrencyDefinition[] = [
  { code: "USD", name: "US Dollar", decimals: 2, kind: "fiat" },
  { code: "EUR", name: "Euro", decimals: 2, kind: "fiat" },
  { code: "USDC", name: "USD Coin", decimals: 6, kind: "stablecoin" },
  { code: "EURC", name: "Euro Coin", decimals: 6, kind: "stablecoin" },
  { code: "SOL", name: "Solana", decimals: 9, kind: "native" },
  { code: "SUI", name: "Sui", decimals: 9, kind: "native" },
  { code: "PWRC", name: "PowerChain", decimals: 9, kind: "utility" }
] as const;

export const DEFAULT_DISPLAY_CURRENCY: CurrencyCode = "USD";
