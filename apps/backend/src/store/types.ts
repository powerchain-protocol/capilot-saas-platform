export type Role = "owner" | "admin" | "operator" | "analyst" | "viewer";
export type Plan = "free" | "pro" | "business";
export type AssetType = "solar" | "wind" | "storage" | "ev" | "meter";
export type ApprovalStatus = "pending" | "approved" | "changes_requested";
export type MessageRole = "user" | "assistant" | "system";

export type User = { id: string; email: string; name: string; passwordHash: string; createdAt: string };
export type Workspace = { id: string; name: string; slug: string; plan: Plan; createdAt: string };
export type Membership = { id: string; userId: string; workspaceId: string; role: Role };
export type SessionRecord = { id: string; userId: string; workspaceId: string; role: Role; persistent: boolean; expiresAt: string; revokedAt: string | null; createdAt: string; lastSeenAt: string };
export type Asset = { id: string; workspaceId: string; slug: string; name: string; type: AssetType; location: string; capacityMw: number; availability: number; status: "operational" | "attention" | "offline"; verified: boolean };
export type Approval = { id: string; workspaceId: string; slug: string; title: string; description: string; severity: "low" | "medium" | "high"; amount?: string; status: ApprovalStatus; updatedAt: string };
export type Activity = { id: string; workspaceId: string; kind: "asset" | "approval" | "copilot" | "system" | "billing"; title: string; detail: string; createdAt: string };
export type Chat = { id: string; workspaceId: string; userId: string; slug: string; title: string; createdAt: string; updatedAt: string };
export type Message = { id: string; chatId: string; workspaceId: string; userId: string; role: MessageRole; content: string; createdAt: string };
export type ContactRequest = { id: string; name: string; email: string; company: string; message: string; intent: string; createdAt: string };
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
export type CreditQuoteStatus = "quoted" | "reserved" | "settled" | "released" | "expired";
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
export type CreditReservationResult =
  | { ok: true; quote: CreditQuote; account: CreditAccount; ledger: CreditLedgerEntry }
  | { ok: false; reason: "not_found" | "invalid_state" | "expired" | "insufficient"; available?: string; required?: string };
export type CreditSettlementResult =
  | { ok: true; quote: CreditQuote; account: CreditAccount; ledger: CreditLedgerEntry; receipt: CreditReceipt; message: Message }
  | { ok: false; reason: "not_found" | "invalid_state" };

export type AccountBundle = { user: User; workspace: Workspace; membership: Membership };

export interface Store {
  health(): Promise<{ ok: boolean; adapter: "postgres" | "memory"; latencyMs: number }>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  getWorkspace(id: string): Promise<Workspace | null>;
  getMembershipForUser(userId: string): Promise<Membership | null>;
  createAccount(input: { name: string; email: string; passwordHash: string; workspaceName: string; plan: Plan }): Promise<AccountBundle>;
  ensureDemoAccount(passwordHash: string): Promise<AccountBundle>;
  updateProfile(input: { userId: string; workspaceId: string; name: string; workspaceName: string }): Promise<{ user: User; workspace: Workspace } | null>;
  createSession(input: Omit<SessionRecord, "createdAt" | "lastSeenAt" | "revokedAt">): Promise<SessionRecord>;
  getSession(id: string): Promise<SessionRecord | null>;
  touchSession(id: string): Promise<void>;
  listSessions(userId: string): Promise<SessionRecord[]>;
  revokeSession(id: string, userId: string): Promise<boolean>;
  listAssets(workspaceId: string): Promise<Asset[]>;
  listApprovals(workspaceId: string): Promise<Approval[]>;
  updateApproval(workspaceId: string, approvalId: string, status: ApprovalStatus): Promise<Approval | null>;
  listActivities(workspaceId: string, limit?: number): Promise<Activity[]>;
  addActivity(workspaceId: string, kind: Activity["kind"], title: string, detail: string): Promise<Activity>;
  createChat(workspaceId: string, userId: string, title: string): Promise<Chat>;
  listChats(workspaceId: string, userId: string): Promise<Chat[]>;
  getChat(workspaceId: string, userId: string, idOrSlug: string): Promise<Chat | null>;
  addMessage(input: { chatId: string; workspaceId: string; userId: string; role: MessageRole; content: string }): Promise<Message>;
  listMessages(chatId: string, workspaceId: string, userId: string, limit?: number): Promise<Message[]>;
  getMessage(messageId: string, workspaceId: string, userId: string): Promise<Message | null>;
  addContact(input: Omit<ContactRequest, "id" | "createdAt">): Promise<ContactRequest>;
  getCreditAccount(workspaceId: string, userId: string): Promise<CreditAccount>;
  listCreditLedger(workspaceId: string, userId: string, limit?: number): Promise<CreditLedgerEntry[]>;
  createCreditQuote(input: Omit<CreditQuote, "id" | "accountId" | "status" | "createdAt" | "updatedAt" | "responseMessageId">): Promise<CreditQuote>;
  reserveCreditQuote(quoteId: string, workspaceId: string, userId: string): Promise<CreditReservationResult>;
  releaseCreditQuote(quoteId: string, workspaceId: string, userId: string, reference: string): Promise<boolean>;
  releaseStaleCreditReservations(staleBefore: string, limit?: number): Promise<number>;
  completeCreditSettledMessage(input: { quoteId: string; chatId: string; workspaceId: string; userId: string; content: string }): Promise<CreditSettlementResult>;
  listCreditQuotes(workspaceId: string, userId: string, limit?: number): Promise<CreditQuote[]>;
  listCreditReceipts(workspaceId: string, userId: string, limit?: number): Promise<CreditReceipt[]>;
}
