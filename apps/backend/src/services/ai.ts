import type { Asset } from "../store/types";
import { ApiError } from "../api/v1/middlewares/http";
import { env } from "../config/env";

export type ManagedProviderId = "openai" | "anthropic" | "gemini" | "deepseek" | "ollama";

export type AiReply = {
  mode: "managed" | "demo";
  provider: ManagedProviderId | "powerchain-demo";
  model: string;
  text: string;
  actions: Array<{ id: string; label: string; href: string }>;
};

export type AiRuntimeModel = {
  provider: ManagedProviderId;
  model: string;
  configured: boolean;
  local: boolean;
};

const managedProviders: readonly ManagedProviderId[] = ["openai", "anthropic", "gemini", "deepseek", "ollama"];

function isManagedProvider(value: string): value is ManagedProviderId {
  return managedProviders.includes(value as ManagedProviderId);
}

function actions(): AiReply["actions"] {
  return [
    { id: "assets", label: "Review assets", href: "/dashboard/assets" },
    { id: "approvals", label: "Review approvals", href: "/dashboard/approvals" }
  ];
}

function deterministicReply(prompt: string, assets: Asset[]): AiReply {
  const available = assets.length ? (assets.reduce((sum, asset) => sum + asset.availability, 0) / assets.length).toFixed(1) : "0.0";
  const capacity = assets.reduce((sum, asset) => sum + asset.capacityMw, 0);
  const attention = assets.filter((asset) => asset.status !== "operational");
  const summary = [
    `Workspace context: ${assets.length} connected assets, ${capacity} MW total capacity, ${available}% average availability.`,
    attention.length ? `${attention.length} asset${attention.length === 1 ? "" : "s"} currently require attention: ${attention.map((asset) => asset.name).join(", ")}.` : "No connected assets currently require operational attention.",
    `Your request was: “${prompt.slice(0, 220)}${prompt.length > 220 ? "…" : ""}”`,
    "This is representative analysis only. Review source evidence before operational, treasury, or onchain execution."
  ].join("\n\n");
  return { mode: "demo", provider: "powerchain-demo", model: "deterministic-development", text: summary, actions: actions() };
}

function assetContext(assets: Asset[]) {
  return assets.map((asset) => ({
    id: asset.id,
    slug: asset.slug,
    name: asset.name,
    type: asset.type,
    capacityMw: asset.capacityMw,
    availability: asset.availability,
    status: asset.status,
    verified: asset.verified
  }));
}

function systemInstruction(): string {
  return "You are PowerChain Copilot. Analyze only supplied workspace context. Never invent live telemetry, balances, transaction status, settlement evidence, or approvals. Clearly label uncertainty. Do not execute actions.";
}

function objectRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : null;
}

function extractOpenAiText(payload: unknown): string | null {
  const record = objectRecord(payload);
  if (!record) return null;
  if (typeof record.output_text === "string" && record.output_text.trim()) return record.output_text.trim();
  if (!Array.isArray(record.output)) return null;
  for (const output of record.output) {
    const outputRecord = objectRecord(output);
    if (!outputRecord || !Array.isArray(outputRecord.content)) continue;
    for (const item of outputRecord.content) {
      const itemRecord = objectRecord(item);
      if (typeof itemRecord?.text === "string" && itemRecord.text.trim()) return itemRecord.text.trim();
    }
  }
  return null;
}

function extractAnthropicText(payload: unknown): string | null {
  const record = objectRecord(payload);
  if (!record || !Array.isArray(record.content)) return null;
  for (const item of record.content) {
    const itemRecord = objectRecord(item);
    if (typeof itemRecord?.text === "string" && itemRecord.text.trim()) return itemRecord.text.trim();
  }
  return null;
}

function extractGeminiText(payload: unknown): string | null {
  const record = objectRecord(payload);
  if (!record || !Array.isArray(record.candidates)) return null;
  for (const candidate of record.candidates) {
    const candidateRecord = objectRecord(candidate);
    const content = objectRecord(candidateRecord?.content);
    if (!content || !Array.isArray(content.parts)) continue;
    for (const part of content.parts) {
      const partRecord = objectRecord(part);
      if (typeof partRecord?.text === "string" && partRecord.text.trim()) return partRecord.text.trim();
    }
  }
  return null;
}

function extractChatCompletionText(payload: unknown): string | null {
  const record = objectRecord(payload);
  if (!record || !Array.isArray(record.choices)) return null;
  for (const choice of record.choices) {
    const choiceRecord = objectRecord(choice);
    const message = objectRecord(choiceRecord?.message);
    if (typeof message?.content === "string" && message.content.trim()) return message.content.trim();
  }
  return null;
}

function extractOllamaText(payload: unknown): string | null {
  const record = objectRecord(payload);
  const message = objectRecord(record?.message);
  return typeof message?.content === "string" && message.content.trim() ? message.content.trim() : null;
}

async function fetchJson(url: string, init: RequestInit): Promise<{ response: Response; payload: unknown }> {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(env.aiRequestTimeoutMs) });
  let payload: unknown = null;
  try { payload = await response.json(); } catch { payload = null; }
  return { response, payload };
}

async function generateOpenAi(prompt: string, assets: Asset[]): Promise<AiReply> {
  const { response, payload } = await fetchJson("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${env.openAiApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ model: env.openAiModel, input: [{ role: "system", content: systemInstruction() }, { role: "user", content: JSON.stringify({ prompt, workspaceAssets: assetContext(assets) }) }] })
  });
  const text = response.ok ? extractOpenAiText(payload) : null;
  if (!response.ok || !text) throw new Error(`OpenAI request failed with HTTP ${response.status}.`);
  return { mode: "managed", provider: "openai", model: env.openAiModel, text, actions: actions() };
}

async function generateAnthropic(prompt: string, assets: Asset[]): Promise<AiReply> {
  const { response, payload } = await fetchJson(env.anthropicApiUrl, {
    method: "POST",
    headers: { "x-api-key": env.anthropicApiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: env.anthropicModel, max_tokens: 1800, system: systemInstruction(), messages: [{ role: "user", content: JSON.stringify({ prompt, workspaceAssets: assetContext(assets) }) }] })
  });
  const text = response.ok ? extractAnthropicText(payload) : null;
  if (!response.ok || !text) throw new Error(`Anthropic request failed with HTTP ${response.status}.`);
  return { mode: "managed", provider: "anthropic", model: env.anthropicModel, text, actions: actions() };
}

async function generateGemini(prompt: string, assets: Asset[]): Promise<AiReply> {
  const url = `${env.geminiApiUrl.replace(/\/$/, "")}/${encodeURIComponent(env.geminiModel)}:generateContent?key=${encodeURIComponent(env.geminiApiKey)}`;
  const { response, payload } = await fetchJson(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: systemInstruction() }] }, contents: [{ role: "user", parts: [{ text: JSON.stringify({ prompt, workspaceAssets: assetContext(assets) }) }] }] })
  });
  const text = response.ok ? extractGeminiText(payload) : null;
  if (!response.ok || !text) throw new Error(`Gemini request failed with HTTP ${response.status}.`);
  return { mode: "managed", provider: "gemini", model: env.geminiModel, text, actions: actions() };
}

async function generateDeepSeek(prompt: string, assets: Asset[]): Promise<AiReply> {
  const { response, payload } = await fetchJson(env.deepSeekApiUrl, {
    method: "POST",
    headers: { authorization: `Bearer ${env.deepSeekApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ model: env.deepSeekModel, messages: [{ role: "system", content: systemInstruction() }, { role: "user", content: JSON.stringify({ prompt, workspaceAssets: assetContext(assets) }) }] })
  });
  const text = response.ok ? extractChatCompletionText(payload) : null;
  if (!response.ok || !text) throw new Error(`DeepSeek request failed with HTTP ${response.status}.`);
  return { mode: "managed", provider: "deepseek", model: env.deepSeekModel, text, actions: actions() };
}

async function generateOllama(prompt: string, assets: Asset[]): Promise<AiReply> {
  const url = `${env.ollamaApiUrl.replace(/\/$/, "")}/api/chat`;
  const { response, payload } = await fetchJson(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: env.ollamaModel, stream: false, messages: [{ role: "system", content: systemInstruction() }, { role: "user", content: JSON.stringify({ prompt, workspaceAssets: assetContext(assets) }) }] })
  });
  const text = response.ok ? extractOllamaText(payload) : null;
  if (!response.ok || !text) throw new Error(`Ollama request failed with HTTP ${response.status}.`);
  return { mode: "managed", provider: "ollama", model: env.ollamaModel, text, actions: actions() };
}

export function aiRuntimeModels(): readonly AiRuntimeModel[] {
  return [
    { provider: "openai", model: env.openAiModel, configured: Boolean(env.openAiApiKey), local: false },
    { provider: "anthropic", model: env.anthropicModel, configured: Boolean(env.anthropicApiKey), local: false },
    { provider: "gemini", model: env.geminiModel, configured: Boolean(env.geminiApiKey), local: false },
    { provider: "deepseek", model: env.deepSeekModel, configured: Boolean(env.deepSeekApiKey), local: false },
    { provider: "ollama", model: env.ollamaModel, configured: Boolean(env.ollamaApiUrl), local: true }
  ];
}

async function generateWithProvider(provider: ManagedProviderId, prompt: string, assets: Asset[]): Promise<AiReply> {
  if (provider === "openai") return generateOpenAi(prompt, assets);
  if (provider === "anthropic") return generateAnthropic(prompt, assets);
  if (provider === "gemini") return generateGemini(prompt, assets);
  if (provider === "deepseek") return generateDeepSeek(prompt, assets);
  return generateOllama(prompt, assets);
}

export async function generateAiReply(prompt: string, assets: Asset[]): Promise<AiReply> {
  const configured = new Map(aiRuntimeModels().map((model) => [model.provider, model.configured]));
  const ordered = env.aiProviderOrder.filter(isManagedProvider).filter((provider, index, all) => all.indexOf(provider) === index);
  let lastError: Error | null = null;

  for (const provider of ordered) {
    if (!configured.get(provider)) continue;
    try {
      return await generateWithProvider(provider, prompt, assets);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("AI provider failed.");
    }
  }

  if (env.allowDemoAi) return deterministicReply(prompt, assets);
  if (lastError) throw new ApiError("Configured AI providers were unavailable.", { status: 502, code: "AI_PROVIDER_ERROR" });
  throw new ApiError("No managed AI provider is configured.", { status: 503, code: "AI_PROVIDER_UNAVAILABLE" });
}
