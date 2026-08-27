import type { FastifyInstance } from "fastify";
import { getStore } from "../../../store";
import { requireAuth } from "../middlewares/auth";
import { sendOk } from "../middlewares/http";

export async function registerCreditRoutes(app: FastifyInstance): Promise<void> {
  app.get("/credits", async (request, reply) => {
    const auth = await requireAuth(request);
    const account = await getStore().getCreditAccount(auth.workspace.id, auth.user.id);
    return sendOk(reply, {
      account,
      pricing: { completedResponsePwrc: "10000" },
      lifecycle: ["quote", "reserve", "deliver", "settle", "receipt"] as const
    });
  });

  app.get("/credits/ledger", async (request, reply) => {
    const auth = await requireAuth(request);
    const query = request.query as { limit?: string };
    const parsed = Number(query.limit ?? 50);
    const limit = Number.isFinite(parsed) ? Math.max(1, Math.min(Math.floor(parsed), 100)) : 50;
    return sendOk(reply, await getStore().listCreditLedger(auth.workspace.id, auth.user.id, limit));
  });
}
