const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const dateTime = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

export const formatUsd = (value: number) => usd.format(value);
export const formatNumber = (value: number) => number.format(value);
export const formatCompact = (value: number) => compactNumber.format(value);
export const formatPercent = (value: number, digits = 1) => `${value.toFixed(digits)}%`;
export const formatMw = (value: number) => `${formatNumber(value)} MW`;
export const formatMwh = (value: number) => `${formatNumber(value)} MWh`;
export const formatDateTime = (value: Date | string | number) => dateTime.format(new Date(value));

export function formatRelativeTime(value: Date | string | number) {
  const delta = Date.now() - new Date(value).getTime();
  const seconds = Math.max(0, Math.round(delta / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
