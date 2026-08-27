import type { FastifyInstance, FastifyRequest } from "fastify";
import { getStore } from "../../../store";
import { requireAuth } from "../middlewares/auth";
import { sanitizeText, sendError, sendOk } from "../middlewares/http";
import { sameOriginOrAllowed } from "../middlewares/security";

function bodyRecord(request: FastifyRequest): Record<string, unknown> { return typeof request.body === "object" && request.body !== null ? request.body as Record<string, unknown> : {}; }

export async function registerProfileRoutes(app: FastifyInstance): Promise<void> {
  app.patch("/profile", async (request, reply) => {
    if (!sameOriginOrAllowed(request)) return sendError(reply, "Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
    const auth = await requireAuth(request);
    const body = bodyRecord(request);
    const name = sanitizeText(body.name, 120);
    const workspaceName = sanitizeText(body.workspaceName, 160);
    if (name.length < 2 || workspaceName.length < 2) return sendError(reply, "Name and workspace name are required.", 422, "VALIDATION");
    const updated = await getStore().updateProfile({ userId: auth.user.id, workspaceId: auth.workspace.id, name, workspaceName });
    if (!updated) return sendError(reply, "Profile context was not found.", 404, "NOT_FOUND");
    return sendOk(reply, updated);
  });
}
