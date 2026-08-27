export const SECOND_MS = 1_000;
export const MINUTE_MS = 60 * SECOND_MS;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

export function epochSeconds(): number { return Math.floor(Date.now() / SECOND_MS); }
export function epochMs(): number { return Date.now(); }
export function isoFromEpochMs(value: number): string { return new Date(value).toISOString(); }
