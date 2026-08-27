import type { FastifyInstance, FastifyRequest } from "fastify";
import { getEnvironmentProfile } from "@powerchain/shared";
import { env } from "../../../config/env.ts";
import { solanaAccountSnapshot, solanaHealth, solanaTransactionSnapshot } from "../../../services/solana.ts";
import { requireAuth } from "../middlewares/auth.ts";
import { sendOk } from "../middlewares/http.ts";
import { rateLimit } from "../middlewares/security.ts";

function paramsRecord(request: FastifyRequest): Record<string, unknown> {
  return typeof request.params === "object" && request.params !== null ? request.params as Record<string, unknown> : {};
}

function stringParam(request: FastifyRequest, key: string): string {
  const value = paramsRecord(request)[key];
  return typeof value === "string" ? value : "";
}

export async function registerNetworkRoutes(app: FastifyInstance): Promise<void> {
  app.get("/network/profile", async (request, reply) => {
    await requireAuth(request);
    const profile = getEnvironmentProfile(env.powerChainEnvironment);
    return sendOk(reply, {
      environment: profile.id,
      production: profile.production,
      solanaCluster: env.solanaCluster,
      solanaCommitment: env.solanaCommitment,
      suiNetwork: env.suiNetwork,
      representativeDataAllowed: profile.allowRepresentativeData
    });
  });

  app.get("/network/solana", async (request, reply) => {
    await requireAuth(request);
    if (!rateLimit(request, "solana-health", 60, 60_000)) return reply.code(429).send({ ok: false, error: { code: "RATE_LIMITED", message: "Solana status request limit exceeded." } });
    return sendOk(reply, await solanaHealth());
  });

  app.get("/network/solana/accounts/:address", async (request, reply) => {
    await requireAuth(request);
    if (!rateLimit(request, "solana-account", 120, 60_000)) return reply.code(429).send({ ok: false, error: { code: "RATE_LIMITED", message: "Solana account request limit exceeded." } });
    return sendOk(reply, await solanaAccountSnapshot(stringParam(request, "address")));
  });

  app.get("/network/solana/transactions/:signature", async (request, reply) => {
    await requireAuth(request);
    if (!rateLimit(request, "solana-transaction", 120, 60_000)) return reply.code(429).send({ ok: false, error: { code: "RATE_LIMITED", message: "Solana transaction request limit exceeded." } });
    return sendOk(reply, await solanaTransactionSnapshot(stringParam(request, "signature")));
  });
}
