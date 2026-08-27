import type { FastifyInstance } from "fastify";
import { solanaHealth } from "../../../services/solana";
import { requireAuth } from "../middlewares/auth";
import { sendOk } from "../middlewares/http";

export async function registerNetworkRoutes(app: FastifyInstance): Promise<void> {
  app.get("/network/solana", async (request, reply) => {
    await requireAuth(request);
    return sendOk(reply, await solanaHealth());
  });
}
