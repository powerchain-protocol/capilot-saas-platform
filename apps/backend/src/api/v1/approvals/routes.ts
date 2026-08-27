import type { FastifyInstance, FastifyRequest } from "fastify";
import { getStore } from "../../../store";
import { requireAuth, requireRole } from "../middlewares/auth";
import { sanitizeText, sendError, sendOk } from "../middlewares/http";
import { sameOriginOrAllowed } from "../middlewares/security";

function bodyRecord(request: FastifyRequest): Record<string, unknown> { return typeof request.body === "object" && request.body !== null ? request.body as Record<string, unknown> : {}; }

export async function registerApprovalRoutes(app: FastifyInstance): Promise<void> {
  app.get("/approvals", async (request, reply) => {
    const auth = await requireAuth(request);
    return sendOk(reply, await getStore().listApprovals(auth.workspace.id));
  });

  app.post<{ Params: { id: string } }>("/approvals/:id", async (request, reply) => {
    if (!sameOriginOrAllowed(request)) return sendError(reply, "Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
    const auth = await requireAuth(request);
    requireRole(auth, ["owner", "admin", "operator"]);
    const action = sanitizeText(bodyRecord(request).action, 32);
    if (action !== "approve" && action !== "request_changes") return sendError(reply, "Approval action must be approve or request_changes.", 422, "VALIDATION");
    const status = action === "approve" ? "approved" : "changes_requested";
    const store = getStore();
    const approval = await store.updateApproval(auth.workspace.id, request.params.id, status);
    if (!approval) return sendError(reply, "Approval not found.", 404, "NOT_FOUND");
    await store.addActivity(auth.workspace.id, "approval", `${approval.title} · ${status.replace("_", " ")}`, `Action recorded by ${auth.role}`);
    return sendOk(reply, approval);
  });
}
