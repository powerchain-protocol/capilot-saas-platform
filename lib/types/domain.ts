export type Role = "owner" | "admin" | "operator" | "analyst" | "viewer";
export type Plan = "free" | "pro" | "business";

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
};

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  createdAt: string;
};

export type Membership = {
  id: string;
  userId: string;
  workspaceId: string;
  role: Role;
};

export type Asset = {
  id: string;
  workspaceId: string;
  name: string;
  type: "solar" | "wind" | "storage" | "ev" | "meter";
  location: string;
  capacityMw: number;
  availability: number;
  status: "operational" | "attention" | "offline";
  verified: boolean;
};

export type ApprovalStatus = "pending" | "approved" | "changes_requested";
export type Approval = {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  amount?: string;
  status: ApprovalStatus;
  updatedAt: string;
};

export type Activity = {
  id: string;
  workspaceId: string;
  kind: "asset" | "approval" | "copilot" | "system" | "billing";
  title: string;
  detail: string;
  createdAt: string;
};

export type Message = {
  id: string;
  workspaceId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};


export type LegalAcceptance = {
  id: string;
  userId: string;
  document: "terms";
  version: string;
  acceptedAt: string;
};

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  intent: string;
  createdAt: string;
};

export type AppState = {
  users: User[];
  workspaces: Workspace[];
  memberships: Membership[];
  assets: Asset[];
  approvals: Approval[];
  activities: Activity[];
  messages: Message[];
  contacts: ContactRequest[];
  legalAcceptances: LegalAcceptance[];
};

export type Session = {
  userId: string;
  workspaceId: string;
  role: Role;
  exp: number;
  persistent?: boolean;
};
