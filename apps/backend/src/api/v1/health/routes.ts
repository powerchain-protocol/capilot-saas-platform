import type { FastifyInstance } from "fastify";
import { collectHealth } from "../../../utils/health.ts";
import { sendOk } from "../middlewares/http.ts";

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async (_request, reply) => sendOk(reply, await collectHealth()));
}
