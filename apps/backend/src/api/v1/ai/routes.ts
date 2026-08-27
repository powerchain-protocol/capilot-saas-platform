import type { FastifyInstance, FastifyRequest } from "fastify";
import { MAX_MESSAGE_LENGTH } from "../../../constants/api";
import { env } from "../../../config/env";
import { getStore } from "../../../store";
import { aiRuntimeModels, generateAiReply } from "../../../services/ai";
import { requireAuth } from "../middlewares/auth";
import { sanitizeText, sendError, sendOk } from "../middlewares/http";
import { rateLimit, sameOriginOrAllowed } from "../middlewares/security";

function bodyRecord(request: FastifyRequest): Record<string, unknown> {
  return typeof request.body === "object" && request.body !== null ? request.body as Record<string, unknown> : {};
}

export async function registerAiRoutes(app: FastifyInstance): Promise<void> {
  app.get("/ai/models", async (request, reply) => {
    await requireAuth(request);
    return sendOk(reply, {
      environment: env.powerChainEnvironment,
      providerOrder: env.aiProviderOrder,
      models: aiRuntimeModels()
    });
  });

  app.post("/ai/generate", async (request, reply) => {
    if (!env.allowUnbilledAiPreview) return sendError(reply, "Unbilled AI preview is disabled. Use the persisted chat endpoint for governed completed-response billing.", 403, "AI_PREVIEW_DISABLED");
    if (!sameOriginOrAllowed(request)) return sendError(reply, "Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
    if (!rateLimit(request, "ai-preview", 20, 60_000)) return sendError(reply, "Too many preview requests. Try again shortly.", 429, "RATE_LIMITED");
    const auth = await requireAuth(request);
    const prompt = sanitizeText(bodyRecord(request).prompt, MAX_MESSAGE_LENGTH);
    if (prompt.length < 2) return sendError(reply, "Prompt is required.", 422, "VALIDATION");
    const assets = await getStore().listAssets(auth.workspace.id);
    return sendOk(reply, await generateAiReply(prompt, assets));
  });
}
