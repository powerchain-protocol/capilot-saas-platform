import { env } from "../config/env";
import type { Asset } from "../store/types";
import { ApiError } from "../api/v1/middlewares/http";

export type AiReply = {
  mode: "managed" | "demo";
  text: string;
  actions: Array<{ id: string; label: string; href: string }>;
};

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
  return {
    mode: "demo",
    text: summary,
    actions: [
      { id: "assets", label: "Review assets", href: "/dashboard/assets" },
      { id: "approvals", label: "Review approvals", href: "/dashboard/approvals" }
    ]
  };
}

function extractResponseText(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const record = payload as Record<string, unknown>;
  if (typeof record.output_text === "string" && record.output_text.trim()) return record.output_text.trim();
  if (!Array.isArray(record.output)) return null;
  for (const output of record.output) {
    if (typeof output !== "object" || output === null) continue;
    const content = (output as Record<string, unknown>).content;
    if (!Array.isArray(content)) continue;
    for (const item of content) {
      if (typeof item !== "object" || item === null) continue;
      const text = (item as Record<string, unknown>).text;
      if (typeof text === "string" && text.trim()) return text.trim();
    }
  }
  return null;
}

export async function generateAiReply(prompt: string, assets: Asset[]): Promise<AiReply> {
  if (!env.openAiApiKey) {
    if (env.allowDemoAi) return deterministicReply(prompt, assets);
    throw new ApiError("No managed AI provider is configured.", { status: 503, code: "AI_PROVIDER_UNAVAILABLE" });
  }

  const assetContext = assets.map((asset) => ({ id: asset.id, slug: asset.slug, name: asset.name, type: asset.type, capacityMw: asset.capacityMw, availability: asset.availability, status: asset.status, verified: asset.verified }));
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${env.openAiApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: env.openAiModel,
      input: [
        { role: "system", content: "You are PowerChain Copilot. Analyze only supplied workspace context. Never invent live telemetry, balances, transaction status, settlement evidence, or approvals. Clearly label uncertainty. Do not execute actions." },
        { role: "user", content: JSON.stringify({ prompt, workspaceAssets: assetContext }) }
      ]
    }),
    signal: AbortSignal.timeout(30_000)
  });
  if (!response.ok) {
    if (env.allowDemoAi) return deterministicReply(prompt, assets);
    throw new ApiError(`Managed AI provider returned HTTP ${response.status}.`, { status: 502, code: "AI_PROVIDER_ERROR" });
  }
  const payload: unknown = await response.json();
  const text = extractResponseText(payload);
  if (!text) {
    if (env.allowDemoAi) return deterministicReply(prompt, assets);
    throw new ApiError("Managed AI provider returned an empty response.", { status: 502, code: "AI_EMPTY_RESPONSE" });
  }
  return {
    mode: "managed",
    text,
    actions: [
      { id: "assets", label: "Review assets", href: "/dashboard/assets" },
      { id: "approvals", label: "Review approvals", href: "/dashboard/approvals" }
    ]
  };
}
