import type { AiProviderId } from "./providers";

export type AiModelCapability = "chat" | "reasoning" | "tools" | "vision" | "local" | "energy-context";

export type AiModelDefinition = {
  id: string;
  provider: AiProviderId;
  label: string;
  capabilities: readonly AiModelCapability[];
  defaultForProvider: boolean;
  serverConfigurable: boolean;
  description: string;
};

/**
 * Canonical model aliases used by PowerChain Copilot configuration.
 * Provider availability is runtime/configuration dependent; this registry does
 * not claim a provider credential or model deployment is active.
 */
export const AI_MODELS: readonly AiModelDefinition[] = [
  {
    id: "powerchain-copilot",
    provider: "powerchain",
    label: "PowerChain Copilot",
    capabilities: ["chat", "reasoning", "tools", "energy-context"],
    defaultForProvider: true,
    serverConfigurable: true,
    description: "PowerChain domain orchestration alias for governed renewable-infrastructure analysis."
  },
  {
    id: "gpt-5.6-mini",
    provider: "openai",
    label: "GPT-5.6 Mini",
    capabilities: ["chat", "reasoning", "tools", "vision"],
    defaultForProvider: true,
    serverConfigurable: true,
    description: "Default OpenAI model alias; override OPENAI_MODEL when a different deployment is required."
  },
  {
    id: "claude-sonnet-4-5",
    provider: "anthropic",
    label: "Claude Sonnet",
    capabilities: ["chat", "reasoning", "tools", "vision"],
    defaultForProvider: true,
    serverConfigurable: true,
    description: "Anthropic model alias; runtime availability depends on server configuration."
  },
  {
    id: "gemini-2.5-pro",
    provider: "gemini",
    label: "Gemini Pro",
    capabilities: ["chat", "reasoning", "tools", "vision"],
    defaultForProvider: true,
    serverConfigurable: true,
    description: "Gemini model alias; runtime availability depends on server configuration."
  },
  {
    id: "deepseek-chat",
    provider: "deepseek",
    label: "DeepSeek Chat",
    capabilities: ["chat", "reasoning"],
    defaultForProvider: true,
    serverConfigurable: true,
    description: "DeepSeek OpenAI-compatible chat model alias."
  },
  {
    id: "llama3.3",
    provider: "ollama",
    label: "Llama 3.3",
    capabilities: ["chat", "local"],
    defaultForProvider: true,
    serverConfigurable: true,
    description: "Local/private Ollama model alias."
  }
] as const;

export function modelsForProvider(provider: AiProviderId): readonly AiModelDefinition[] {
  return AI_MODELS.filter((model) => model.provider === provider);
}

export function defaultModelForProvider(provider: AiProviderId): AiModelDefinition | undefined {
  return AI_MODELS.find((model) => model.provider === provider && model.defaultForProvider);
}
