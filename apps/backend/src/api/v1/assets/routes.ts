import type { FastifyInstance } from "fastify";
import { getStore } from "../../../store";
import { requireAuth } from "../middlewares/auth";
import { sendOk } from "../middlewares/http";

export async function registerAssetRoutes(app: FastifyInstance): Promise<void> {
  app.get("/assets", async (request, reply) => {
    const auth = await requireAuth(request);
    return sendOk(reply, await getStore().listAssets(auth.workspace.id));
  });
}
