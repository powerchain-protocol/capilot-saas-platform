import type { FastifyInstance } from "fastify";
import { PWRC_TOKEN, SUPPORTED_TOKENS } from "../../../tokens/index.ts";
import { sendOk } from "../middlewares/http.ts";

export async function registerTokenRoutes(app: FastifyInstance): Promise<void> {
  app.get("/tokens", async (_request, reply) => sendOk(reply, SUPPORTED_TOKENS));
  app.get("/tokens/pwrc", async (_request, reply) => sendOk(reply, PWRC_TOKEN));
}
