export type PromptCategory = "operations" | "assets" | "approvals" | "markets" | "treasury" | "reports";

export type PromptDefinition = {
  id: string;
  title: string;
  prompt: string;
  category: PromptCategory;
  description: string;
  tags: readonly string[];
};

export type SavedPrompt = PromptDefinition & {
  savedAt: string;
};
