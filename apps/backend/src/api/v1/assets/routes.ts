import type { FastifyInstance } from "fastify";
import { getStore } from "../../../store/index.ts";
import { requireAuth } from "../middlewares/auth.ts";
import { sendOk } from "../middlewares/http.ts";

export async function registerAssetRoutes(app: FastifyInstance): Promise<void> {
  app.get("/assets", async (request, reply) => {
    const auth = await requireAuth(request);
    return sendOk(reply, await getStore().listAssets(auth.workspace.id));
  });
}
