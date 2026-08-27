import type { FastifyInstance, FastifyRequest } from "fastify";
import { getStore } from "../../../store/index.ts";
import { sanitizeText, sendError, sendOk } from "../middlewares/http.ts";
import { rateLimit, sameOriginOrAllowed } from "../middlewares/security.ts";

function bodyRecord(request: FastifyRequest): Record<string, unknown> { return typeof request.body === "object" && request.body !== null ? request.body as Record<string, unknown> : {}; }

export async function registerContactRoutes(app: FastifyInstance): Promise<void> {
  app.post("/contact", async (request, reply) => {
    if (!sameOriginOrAllowed(request)) return sendError(reply, "Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
    if (!rateLimit(request, "contact", 10, 60_000)) return sendError(reply, "Too many requests. Try again shortly.", 429, "RATE_LIMITED");
    const body = bodyRecord(request);
    const name = sanitizeText(body.name, 120);
    const email = sanitizeText(body.email, 320).toLowerCase();
    const company = sanitizeText(body.company, 160);
    const message = sanitizeText(body.message, 4_000);
    const intent = sanitizeText(body.intent, 80) || "general";
    if (name.length < 2 || !email.includes("@") || message.length < 10) return sendError(reply, "Name, valid email, and a message are required.", 422, "VALIDATION");
    const item = await getStore().addContact({ name, email, company, message, intent });
    return sendOk(reply, { received: true, id: item.id }, 201);
  });
}
