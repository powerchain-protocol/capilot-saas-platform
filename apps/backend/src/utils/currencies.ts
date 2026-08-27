import { CURRENCIES, type CurrencyCode } from "../constants/currencies.ts";

export function currencyDefinition(code: string) {
  return CURRENCIES.find((item) => item.code === code.toUpperCase()) ?? null;
}

export function isCurrencyCode(code: string): code is CurrencyCode {
  return currencyDefinition(code) !== null;
}

export function formatAtomicCurrency(amount: bigint, code: CurrencyCode): string {
  const currency = currencyDefinition(code);
  if (!currency) return amount.toString();
  const divisor = 10n ** BigInt(currency.decimals);
  const whole = amount / divisor;
  const fraction = (amount % divisor).toString().padStart(currency.decimals, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction} ${code}` : `${whole} ${code}`;
}
