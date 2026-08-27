export type GenericAiInput = {
  prompt: string;
  system?: string;
};

export type GenericAiResult = {
  text: string;
  provider: string;
};

export function createGenericFallback(input: GenericAiInput): GenericAiResult {
  return {
    provider: "deterministic",
    text: `I can analyze this request once a managed provider is configured. Request received: ${input.prompt.slice(0, 240)}`
  };
}
