import type { PromptDefinition } from "@powerchain/shared";

export const PROMPT_LIBRARY: readonly PromptDefinition[] = [
  { id: "asset-performance", title: "Asset performance", prompt: "Analyze the performance of my renewable assets and highlight material anomalies.", category: "assets", description: "Compare output, availability, and anomalies across the current workspace.", tags: ["assets", "performance"] },
  { id: "pending-approvals", title: "Pending approvals", prompt: "Summarize pending approvals, risk, and the evidence I should review before deciding.", category: "approvals", description: "Review approval queue and decision context.", tags: ["approvals", "risk"] },
  { id: "market-context", title: "Market context", prompt: "Summarize current market context relevant to my renewable operations without inventing unavailable prices.", category: "markets", description: "Prepare market context with explicit data provenance.", tags: ["markets", "prices"] },
  { id: "treasury-boundaries", title: "Treasury boundaries", prompt: "Summarize treasury balances, reservations, and policy boundaries using only verified workspace data.", category: "treasury", description: "Review treasury context and control boundaries.", tags: ["treasury", "policy"] },
  { id: "operations-brief", title: "Operations brief", prompt: "Create an operations brief covering asset health, alerts, approvals, and recommended next reviews.", category: "operations", description: "Generate a concise operational briefing.", tags: ["operations", "brief"] },
  { id: "executive-report", title: "Executive report", prompt: "Create a structured renewable-infrastructure executive report from the verified workspace context.", category: "reports", description: "Draft an evidence-aware management report.", tags: ["report", "executive"] }
];

export function getPromptById(id: string): PromptDefinition | undefined {
  return PROMPT_LIBRARY.find((prompt) => prompt.id === id);
}
