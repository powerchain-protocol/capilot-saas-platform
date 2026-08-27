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

export type CreditsSnapshot = {
  account: CreditAccount;
  pricing: { completedResponsePwrc: string };
  lifecycle: readonly ["quote", "reserve", "deliver", "settle", "receipt"];
};
