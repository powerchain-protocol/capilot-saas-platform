import { AI_PROVIDERS, modelsForProvider, type AiProviderId } from "@powerchain/ai";
export { AiProviders } from "@/components/ai/providers";

export type FrontendAiProvider = {
  id: AiProviderId;
  label: string;
  mode: "managed" | "local" | "platform";
  defaultModel: string | null;
  enabledByDefault: boolean;
};

export const FRONTEND_AI_PROVIDERS: readonly FrontendAiProvider[] = AI_PROVIDERS.map((provider) => ({
  id: provider.id,
  label: provider.label,
  mode: provider.mode,
  defaultModel: modelsForProvider(provider.id).find((model) => model.defaultForProvider)?.id ?? null,
  enabledByDefault: provider.enabledByDefault
}));

export const MANAGED_AI_PROVIDER_ORDER = ["openai", "anthropic", "gemini", "deepseek", "ollama"] as const;
