export type CreditAccount = {
  id: string;
  workspaceId: string;
  userId: string;
  asset: "PWRC";
  decimals: 9;
  available: string;
  reserved: string;
  spent: string;
  funded: string;
  updatedAt: string;
};

export type CreditLedgerKind = "fund" | "reserve" | "settle" | "release";
export type CreditLedgerEntry = {
  id: string;
  accountId: string;
  workspaceId: string;
  userId: string;
  kind: CreditLedgerKind;
  amount: string;
  balanceAfter: string;
  reference: string;
  createdAt: string;
};

export type CreditQuoteStatus = "quoted" | "reserved" | "settled" | "released" | "expired";
export type CreditQuote = {
  id: string;
  accountId: string;
  workspaceId: string;
  userId: string;
  chatId: string;
  requestMessageId: string;
  responseMessageId: string | null;
  asset: "PWRC";
  amount: string;
  pricingVersion: "pwrc-message-v1";
  canonicalPayload: string;
  quoteHash: string;
  status: CreditQuoteStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreditReceipt = {
  id: string;
  quoteId: string;
  accountId: string;
  workspaceId: string;
  userId: string;
  chatId: string;
  responseMessageId: string;
  quoteHash: string;
  amount: string;
  reservationLedgerId: string;
  settlementLedgerId: string;
  transferable: false;
  createdAt: string;
};

export type CreditsSnapshot = {
  account: CreditAccount;
  pricing: { completedResponsePwrc: string; pricingVersion: "pwrc-message-v1" };
  lifecycle: readonly ["quote", "reserve", "deliver", "settle", "receipt"];
  latestReceipt: CreditReceipt | null;
};
