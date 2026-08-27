import { createId } from "../utils/ids";
import { entitySlug, slugify } from "../utils/slugs";
import type {
  AccountBundle,
  Activity,
  Approval,
  ApprovalStatus,
  Asset,
  Chat,
  ContactRequest,
  CreditAccount,
  CreditLedgerEntry,
  Membership,
  Message,
  Plan,
  SessionRecord,
  Store,
  User,
  Workspace
} from "../store/types";

function now(): string { return new Date().toISOString(); }

export class MemoryStore implements Store {
  readonly users = new Map<string, User>();
  readonly workspaces = new Map<string, Workspace>();
  readonly memberships = new Map<string, Membership>();
  readonly sessions = new Map<string, SessionRecord>();
  readonly assets = new Map<string, Asset>();
  readonly approvals = new Map<string, Approval>();
  readonly activities = new Map<string, Activity>();
  readonly chats = new Map<string, Chat>();
  readonly messages = new Map<string, Message>();
  readonly contacts = new Map<string, ContactRequest>();
  readonly creditAccounts = new Map<string, CreditAccount>();
  readonly creditLedger = new Map<string, CreditLedgerEntry>();

  async health() { return { ok: true, adapter: "memory" as const, latencyMs: 0 }; }

  async findUserByEmail(email: string) {
    return [...this.users.values()].find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async findUserById(id: string) { return this.users.get(id) ?? null; }
  async getWorkspace(id: string) { return this.workspaces.get(id) ?? null; }
  async getMembershipForUser(userId: string) { return [...this.memberships.values()].find((membership) => membership.userId === userId) ?? null; }

  async createAccount(input: { name: string; email: string; passwordHash: string; workspaceName: string; plan: Plan }): Promise<AccountBundle> {
    const user: User = { id: createId("usr"), email: input.email.toLowerCase(), name: input.name, passwordHash: input.passwordHash, createdAt: now() };
    const workspace: Workspace = { id: createId("wsp"), name: input.workspaceName, slug: `${slugify(input.workspaceName)}-${Date.now().toString(36)}`, plan: input.plan, createdAt: now() };
    const membership: Membership = { id: createId("mem"), userId: user.id, workspaceId: workspace.id, role: "owner" };
    this.users.set(user.id, user);
    this.workspaces.set(workspace.id, workspace);
    this.memberships.set(membership.id, membership);
    this.seedWorkspace(workspace.id);
    this.seedCredits(workspace.id, user.id, user.email === "demo@powerchain.energy");
    return { user, workspace, membership };
  }

  async ensureDemoAccount(passwordHash: string): Promise<AccountBundle> {
    const existing = await this.findUserByEmail("demo@powerchain.energy");
    if (existing) {
      const membership = await this.getMembershipForUser(existing.id);
      if (!membership) throw new Error("Demo membership is missing.");
      const workspace = await this.getWorkspace(membership.workspaceId);
      if (!workspace) throw new Error("Demo workspace is missing.");
      return { user: existing, workspace, membership };
    }
    return this.createAccount({ name: "Demo Operator", email: "demo@powerchain.energy", passwordHash, workspaceName: "PowerChain Demo", plan: "pro" });
  }

  async updateProfile(input: { userId: string; workspaceId: string; name: string; workspaceName: string }) {
    const user = this.users.get(input.userId);
    const workspace = this.workspaces.get(input.workspaceId);
    if (!user || !workspace) return null;
    const nextUser = { ...user, name: input.name };
    const nextWorkspace = { ...workspace, name: input.workspaceName, slug: workspace.slug || slugify(input.workspaceName) };
    this.users.set(nextUser.id, nextUser);
    this.workspaces.set(nextWorkspace.id, nextWorkspace);
    return { user: nextUser, workspace: nextWorkspace };
  }

  async createSession(input: Omit<SessionRecord, "createdAt" | "lastSeenAt" | "revokedAt">) {
    const record: SessionRecord = { ...input, revokedAt: null, createdAt: now(), lastSeenAt: now() };
    this.sessions.set(record.id, record);
    return record;
  }

  async getSession(id: string) { return this.sessions.get(id) ?? null; }
  async touchSession(id: string) { const record = this.sessions.get(id); if (record) this.sessions.set(id, { ...record, lastSeenAt: now() }); }
  async listSessions(userId: string) { return [...this.sessions.values()].filter((record) => record.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
  async revokeSession(id: string, userId: string) { const record = this.sessions.get(id); if (!record || record.userId !== userId) return false; this.sessions.set(id, { ...record, revokedAt: now() }); return true; }

  async listAssets(workspaceId: string) { return [...this.assets.values()].filter((asset) => asset.workspaceId === workspaceId); }
  async listApprovals(workspaceId: string) { return [...this.approvals.values()].filter((approval) => approval.workspaceId === workspaceId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); }

  async updateApproval(workspaceId: string, approvalId: string, status: ApprovalStatus) {
    const approval = this.approvals.get(approvalId);
    if (!approval || approval.workspaceId !== workspaceId) return null;
    const next = { ...approval, status, updatedAt: now() };
    this.approvals.set(approval.id, next);
    return next;
  }

  async listActivities(workspaceId: string, limit = 10) { return [...this.activities.values()].filter((item) => item.workspaceId === workspaceId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit); }

  async addActivity(workspaceId: string, kind: Activity["kind"], title: string, detail: string) {
    const item: Activity = { id: createId("act"), workspaceId, kind, title, detail, createdAt: now() };
    this.activities.set(item.id, item);
    return item;
  }

  async createChat(workspaceId: string, userId: string, title: string) {
    const id = createId("cht");
    const item: Chat = { id, workspaceId, userId, title, slug: entitySlug(title, id), createdAt: now(), updatedAt: now() };
    this.chats.set(item.id, item);
    return item;
  }

  async listChats(workspaceId: string, userId: string) { return [...this.chats.values()].filter((chat) => chat.workspaceId === workspaceId && chat.userId === userId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); }
  async getChat(workspaceId: string, userId: string, idOrSlug: string) { return [...this.chats.values()].find((chat) => chat.workspaceId === workspaceId && chat.userId === userId && (chat.id === idOrSlug || chat.slug === idOrSlug)) ?? null; }

  async addMessage(input: { chatId: string; workspaceId: string; userId: string; role: Message["role"]; content: string }) {
    const item: Message = { id: createId("msg"), ...input, createdAt: now() };
    this.messages.set(item.id, item);
    const chat = this.chats.get(input.chatId);
    if (chat) this.chats.set(chat.id, { ...chat, updatedAt: item.createdAt });
    return item;
  }

  async listMessages(chatId: string, workspaceId: string, userId: string, limit = 100) { return [...this.messages.values()].filter((message) => message.chatId === chatId && message.workspaceId === workspaceId && message.userId === userId).sort((a, b) => a.createdAt.localeCompare(b.createdAt)).slice(-limit); }
  async getMessage(messageId: string, workspaceId: string, userId: string) { const message = this.messages.get(messageId); return message && message.workspaceId === workspaceId && message.userId === userId ? message : null; }

  async addContact(input: Omit<ContactRequest, "id" | "createdAt">) {
    const item: ContactRequest = { id: createId("cnt"), ...input, createdAt: now() };
    this.contacts.set(item.id, item);
    return item;
  }

  async getCreditAccount(workspaceId: string, userId: string): Promise<CreditAccount> {
    const existing = [...this.creditAccounts.values()].find((account) => account.workspaceId === workspaceId && account.userId === userId);
    if (existing) return existing;
    return this.seedCredits(workspaceId, userId, false);
  }

  async listCreditLedger(workspaceId: string, userId: string, limit = 50): Promise<CreditLedgerEntry[]> {
    return [...this.creditLedger.values()]
      .filter((entry) => entry.workspaceId === workspaceId && entry.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, Math.max(1, Math.min(limit, 100)));
  }

  private seedCredits(workspaceId: string, userId: string, demo: boolean): CreditAccount {
    const initial = demo ? 1_000_000n : 0n;
    const account: CreditAccount = {
      id: createId("crd"), workspaceId, userId, asset: "PWRC", decimals: 9,
      available: initial.toString(), reserved: "0", spent: "0", funded: initial.toString(), updatedAt: now()
    };
    this.creditAccounts.set(account.id, account);
    if (initial > 0n) {
      const entry: CreditLedgerEntry = {
        id: createId("clg"), accountId: account.id, workspaceId, userId, kind: "fund",
        amount: initial.toString(), balanceAfter: initial.toString(), reference: "demo_grant", createdAt: now()
      };
      this.creditLedger.set(entry.id, entry);
    }
    return account;
  }

  private seedWorkspace(workspaceId: string): void {
    const assetInputs: Array<Omit<Asset, "id" | "workspaceId" | "slug">> = [
      { name: "Solar Farm 45", type: "solar", location: "Mojave, California", capacityMw: 120, availability: 98, status: "operational", verified: true },
      { name: "Wind Farm North", type: "wind", location: "Aberdeenshire, Scotland", capacityMw: 80, availability: 96, status: "operational", verified: true },
      { name: "Battery Site 08", type: "storage", location: "Espoo, Finland", capacityMw: 42, availability: 94, status: "attention", verified: true },
      { name: "EV Network West", type: "ev", location: "Amsterdam, Netherlands", capacityMw: 18, availability: 99, status: "operational", verified: false }
    ];
    for (const input of assetInputs) {
      const id = createId("ast");
      const asset: Asset = { id, workspaceId, slug: entitySlug(input.name, id), ...input };
      this.assets.set(asset.id, asset);
    }

    const approvalInputs: Array<Omit<Approval, "id" | "workspaceId" | "slug" | "updatedAt">> = [
      { title: "Energy Batch Verification", description: "Solar Farm 45 · 1,250 MWh · meter evidence complete", severity: "high", status: "pending" },
      { title: "Settlement Execution", description: "Treasury settlement to approved counterparty", severity: "medium", amount: "$24,500 USDC", status: "pending" }
    ];
    for (const input of approvalInputs) {
      const id = createId("apr");
      const approval: Approval = { id, workspaceId, slug: entitySlug(input.title, id), updatedAt: now(), ...input };
      this.approvals.set(approval.id, approval);
    }
    void this.addActivity(workspaceId, "system", "Workspace provisioned", "Representative renewable infrastructure data initialized.");
  }
}
