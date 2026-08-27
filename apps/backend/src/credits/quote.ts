import { createHash } from "node:crypto";
import { getStore } from "../store";
import type { CreditQuote } from "../store/types";

export const COPILOT_RESPONSE_PRICE_PWRC = "10000" as const;
export const CREDIT_PRICING_VERSION = "pwrc-message-v1" as const;
export const CREDIT_QUOTE_TTL_MS = 5 * 60 * 1000;

type CanonicalQuotePayload = {
  version: "1.0.0";
  pricingVersion: typeof CREDIT_PRICING_VERSION;
  purpose: "completed_copilot_response";
  asset: "PWRC";
  amount: typeof COPILOT_RESPONSE_PRICE_PWRC;
  workspaceId: string;
  userId: string;
  chatId: string;
  requestMessageId: string;
  issuedAt: string;
  expiresAt: string;
};

function canonicalJson(value: CanonicalQuotePayload): string {
  const keys = Object.keys(value).sort() as Array<keyof CanonicalQuotePayload>;
  return JSON.stringify(Object.fromEntries(keys.map((key) => [key, value[key]])));
}

export async function createCopilotCreditQuote(input: {
  workspaceId: string;
  userId: string;
  chatId: string;
  requestMessageId: string;
}): Promise<CreditQuote> {
  const issuedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + CREDIT_QUOTE_TTL_MS).toISOString();
  const payload: CanonicalQuotePayload = {
    version: "1.0.0",
    pricingVersion: CREDIT_PRICING_VERSION,
    purpose: "completed_copilot_response",
    asset: "PWRC",
    amount: COPILOT_RESPONSE_PRICE_PWRC,
    workspaceId: input.workspaceId,
    userId: input.userId,
    chatId: input.chatId,
    requestMessageId: input.requestMessageId,
    issuedAt,
    expiresAt,
  };
  const canonicalPayload = canonicalJson(payload);
  const quoteHash = createHash("sha256").update(canonicalPayload, "utf8").digest("hex");
  return getStore().createCreditQuote({
    workspaceId: input.workspaceId,
    userId: input.userId,
    chatId: input.chatId,
    requestMessageId: input.requestMessageId,
    asset: "PWRC",
    amount: COPILOT_RESPONSE_PRICE_PWRC,
    pricingVersion: CREDIT_PRICING_VERSION,
    canonicalPayload,
    quoteHash,
    expiresAt,
  });
}
