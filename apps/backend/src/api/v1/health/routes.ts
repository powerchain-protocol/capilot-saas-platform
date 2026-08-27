import type { FastifyInstance } from "fastify";
import { env } from "../../../config/env.ts";
import { APP_VERSION } from "../../../constants/api.ts";
import { collectHealth } from "../../../utils/health.ts";
import { sendOk } from "../middlewares/http.ts";

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health/live", async (_request, reply) => sendOk(reply, {
    status: "alive",
    version: APP_VERSION,
    environment: env.powerChainEnvironment,
    timestamp: new Date().toISOString()
  }));

  app.get("/health/ready", async (_request, reply) => {
    const health = await collectHealth();
    return sendOk(reply, health, health.status === "operational" ? 200 : 503);
  });

  app.get("/health", async (_request, reply) => sendOk(reply, await collectHealth()));
}
