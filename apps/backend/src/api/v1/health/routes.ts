import type { FastifyInstance } from "fastify";
import { collectHealth } from "../../../utils/health";
import { sendOk } from "../middlewares/http";

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async (_request, reply) => sendOk(reply, await collectHealth()));
}
