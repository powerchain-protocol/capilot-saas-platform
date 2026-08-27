export type AiProviderId = "powerchain" | "openai" | "anthropic" | "gemini" | "deepseek" | "ollama";

export type AiProviderDefinition = {
  id: AiProviderId;
  label: string;
  mode: "managed" | "local" | "platform";
  enabledByDefault: boolean;
  description: string;
};

export const AI_PROVIDERS: readonly AiProviderDefinition[] = [
  { id: "powerchain", label: "PowerChain", mode: "platform", enabledByDefault: true, description: "PowerChain operational routing and domain context." },
  { id: "openai", label: "OpenAI", mode: "managed", enabledByDefault: true, description: "Managed reasoning provider when configured server-side." },
  { id: "anthropic", label: "Anthropic", mode: "managed", enabledByDefault: false, description: "Optional managed model provider." },
  { id: "gemini", label: "Gemini", mode: "managed", enabledByDefault: false, description: "Optional managed model provider." },
  { id: "deepseek", label: "DeepSeek", mode: "managed", enabledByDefault: false, description: "Optional managed model provider." },
  { id: "ollama", label: "Ollama", mode: "local", enabledByDefault: false, description: "Local or private model runtime." }
];

export function getProvider(id: AiProviderId): AiProviderDefinition {
  return AI_PROVIDERS.find((provider) => provider.id === id) ?? AI_PROVIDERS[0]!;
}
