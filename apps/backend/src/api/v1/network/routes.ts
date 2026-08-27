import type { FastifyInstance } from "fastify";
import { getEnvironmentProfile } from "@powerchain/shared";
import { env } from "../../../config/env";
import { solanaHealth } from "../../../services/solana";
import { requireAuth } from "../middlewares/auth";
import { sendOk } from "../middlewares/http";

export async function registerNetworkRoutes(app: FastifyInstance): Promise<void> {
  app.get("/network/profile", async (request, reply) => {
    await requireAuth(request);
    const profile = getEnvironmentProfile(env.powerChainEnvironment);
    return sendOk(reply, {
      environment: profile.id,
      production: profile.production,
      solanaCluster: env.solanaCluster,
      suiNetwork: env.suiNetwork,
      representativeDataAllowed: profile.allowRepresentativeData
    });
  });

  app.get("/network/solana", async (request, reply) => {
    await requireAuth(request);
    return sendOk(reply, await solanaHealth());
  });
}
