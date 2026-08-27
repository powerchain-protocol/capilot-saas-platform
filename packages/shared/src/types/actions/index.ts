export type ActionRisk = "low" | "medium" | "high";
export type ActionState = "available" | "review_required" | "approved" | "executing" | "completed" | "rejected";

export type PowerChainAction = {
  id: string;
  label: string;
  description: string;
  category: "navigation" | "analysis" | "approval" | "report" | "onchain";
  risk: ActionRisk;
  state: ActionState;
  href?: string;
  requiresApproval: boolean;
};
