import type { FastifyInstance } from "fastify";
import { getStore } from "../../../store";
import { requireAuth } from "../middlewares/auth";
import { sendError, sendOk } from "../middlewares/http";

export async function registerMessageRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { id: string } }>("/messages/:id", async (request, reply) => {
    const auth = await requireAuth(request);
    const message = await getStore().getMessage(request.params.id, auth.workspace.id, auth.user.id);
    if (!message) return sendError(reply, "Message not found.", 404, "MESSAGE_NOT_FOUND");
    return sendOk(reply, message);
  });
}
