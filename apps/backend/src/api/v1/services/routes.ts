import type { FastifyInstance } from "fastify";
import { env } from "../../../config/env.ts";
import { requireAuth } from "../middlewares/auth.ts";
import { sendOk } from "../middlewares/http.ts";

export async function registerServiceRoutes(app: FastifyInstance): Promise<void> {
  app.get("/services", async (request, reply) => {
    await requireAuth(request);
    return sendOk(reply, [
      { key: "pyth", name: "Pyth", category: "oracle", configured: Boolean(env.pythHermesUrl) },
      { key: "birdeye", name: "Birdeye", category: "market-data", configured: Boolean(env.birdeyeApiKey) },
      { key: "helius", name: "Helius", category: "solana-rpc", configured: Boolean(env.heliusRpcUrl || env.heliusApiKey) },
      { key: "solana-rpc", name: "Solana RPC", category: "network", configured: Boolean(env.solanaRpcUrl || env.heliusRpcUrl || env.nodeEnv !== "production") },
      { key: "postgres", name: "PostgreSQL", category: "storage", configured: Boolean(env.databaseUrl) },
      { key: "supabase", name: "Supabase", category: "realtime-storage", configured: Boolean(env.supabaseUrl && (env.supabaseSecretKey || env.supabasePublishableKey)) }
    ]);
  });
}
