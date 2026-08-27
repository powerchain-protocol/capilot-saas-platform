export const SECOND_MS = 1_000;
export const MINUTE_MS = 60 * SECOND_MS;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

export function nowEpochMs(): number {
  return Date.now();
}

export function nowEpochSeconds(): number {
  return Math.floor(Date.now() / SECOND_MS);
}

export function toIsoFromEpochMs(epochMs: number): string {
  return new Date(epochMs).toISOString();
}

export function toEpochMs(value: string | Date): number {
  const time = value instanceof Date ? value.getTime() : Date.parse(value);
  if (!Number.isFinite(time)) throw new Error("Invalid date value.");
  return time;
}
