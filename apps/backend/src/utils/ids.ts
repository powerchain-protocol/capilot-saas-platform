import { randomUUID } from "node:crypto";

export type EntityPrefix = "usr" | "wsp" | "mem" | "ses" | "ast" | "apr" | "act" | "cht" | "msg" | "cnt" | "leg" | "crd" | "clg";

export function createId(prefix: EntityPrefix): string {
  return `${prefix}_${randomUUID().replaceAll("-", "")}`;
}

export function isEntityId(value: string, prefix?: EntityPrefix): boolean {
  const pattern = prefix
    ? new RegExp(`^${prefix}_[0-9a-f]{32}$`, "i")
    : /^[a-z]{3}_[0-9a-f]{32}$/i;
  return pattern.test(value);
}
