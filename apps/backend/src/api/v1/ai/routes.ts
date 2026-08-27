import type { FastifyInstance, FastifyRequest } from "fastify";
import { getStore } from "../../../store";
import { generateAiReply } from "../../../services/ai";
import { MAX_MESSAGE_LENGTH } from "../../../constants/api";
import { requireAuth } from "../middlewares/auth";
import { sanitizeText, sendError, sendOk } from "../middlewares/http";
import { sameOriginOrAllowed } from "../middlewares/security";

function bodyRecord(request: FastifyRequest): Record<string, unknown> { return typeof request.body === "object" && request.body !== null ? request.body as Record<string, unknown> : {}; }

export async function registerAiRoutes(app: FastifyInstance): Promise<void> {
  app.post("/ai/generate", async (request, reply) => {
    if (!sameOriginOrAllowed(request)) return sendError(reply, "Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
    const auth = await requireAuth(request);
    const prompt = sanitizeText(bodyRecord(request).prompt, MAX_MESSAGE_LENGTH);
    if (prompt.length < 2) return sendError(reply, "Prompt is required.", 422, "VALIDATION");
    const assets = await getStore().listAssets(auth.workspace.id);
    return sendOk(reply, await generateAiReply(prompt, assets));
  });
}
