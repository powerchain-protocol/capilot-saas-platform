import type { FastifyInstance, FastifyRequest } from "fastify";
import { COPILOT_RESPONSE_PRICE_PWRC, CREDIT_PRICING_VERSION } from "../../../credits";
import { getStore } from "../../../store";
import { requireAuth } from "../middlewares/auth";
import { sendOk } from "../middlewares/http";

function boundedLimit(request: FastifyRequest, fallback = 50): number {
  const query = request.query as { limit?: string };
  const parsed = Number(query.limit ?? fallback);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(Math.floor(parsed), 100)) : fallback;
}

export async function registerCreditRoutes(app: FastifyInstance): Promise<void> {
  app.get("/credits", async (request, reply) => {
    const auth = await requireAuth(request);
    const store = getStore();
    const [account, receipts] = await Promise.all([
      store.getCreditAccount(auth.workspace.id, auth.user.id),
      store.listCreditReceipts(auth.workspace.id, auth.user.id, 1),
    ]);
    return sendOk(reply, {
      account,
      pricing: { completedResponsePwrc: COPILOT_RESPONSE_PRICE_PWRC, pricingVersion: CREDIT_PRICING_VERSION },
      lifecycle: ["quote", "reserve", "deliver", "settle", "receipt"] as const,
      latestReceipt: receipts[0] ?? null,
    });
  });

  app.get("/credits/ledger", async (request, reply) => {
    const auth = await requireAuth(request);
    return sendOk(reply, await getStore().listCreditLedger(auth.workspace.id, auth.user.id, boundedLimit(request)));
  });

  app.get("/credits/quotes", async (request, reply) => {
    const auth = await requireAuth(request);
    return sendOk(reply, await getStore().listCreditQuotes(auth.workspace.id, auth.user.id, boundedLimit(request)));
  });

  app.get("/credits/receipts", async (request, reply) => {
    const auth = await requireAuth(request);
    return sendOk(reply, await getStore().listCreditReceipts(auth.workspace.id, auth.user.id, boundedLimit(request)));
  });
}
