import type { FastifyInstance } from "fastify";
import { getBirdeyePrice, getPythPrice } from "../../../services/market.ts";
import { requireAuth } from "../middlewares/auth.ts";
import { ApiError, sendOk } from "../middlewares/http.ts";

export async function registerMarketRoutes(app: FastifyInstance): Promise<void> {
  app.get("/market/price", async (request, reply) => {
    await requireAuth(request);
    const query = request.query as Record<string, unknown>;
    const provider = typeof query.provider === "string" ? query.provider : "auto";
    const address = typeof query.address === "string" ? query.address : "";
    const feedId = typeof query.feedId === "string" ? query.feedId : "";
    if ((provider === "auto" || provider === "pyth") && feedId) return sendOk(reply, await getPythPrice(feedId));
    if ((provider === "auto" || provider === "birdeye") && address) return sendOk(reply, await getBirdeyePrice(address));
    throw new ApiError("Provide feedId for Pyth or address for Birdeye.", { status: 422, code: "PRICE_REQUEST_INVALID" });
  });
}
