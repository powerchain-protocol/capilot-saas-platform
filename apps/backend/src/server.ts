import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import websocket from "@fastify/websocket";
import { env, assertProductionConfiguration } from "./config/env.ts";
import { openApiBaseDir, openApiPath } from "./config/paths.ts";
import { API_PREFIX, PUBLIC_API_PREFIX, PUBLIC_API_ORIGIN, APP_API_ORIGIN, APP_VERSION } from "./constants/api.ts";
import { registerApiV1 } from "./api/v1/index.ts";
import { registerWebSocketRoutes } from "./ws/routes.ts";
import { ApiError, sendError } from "./api/v1/middlewares/http.ts";
import { createRequestContext } from "./context/request-context.ts";
import { requireApiKey } from "./api/v1/middlewares/security.ts";
import { getStore } from "./store/index.ts";

export async function buildServer(): Promise<FastifyInstance> {
  assertProductionConfiguration();
  const app = Fastify({
    logger: {
      level: env.nodeEnv === "production" ? "info" : "debug",
      redact: ["req.headers.authorization", "req.headers.cookie", "req.headers.x-api-key", "res.headers.set-cookie"]
    },
    trustProxy: true,
    bodyLimit: 512 * 1024,
    requestIdHeader: "x-request-id"
  });

  const allowedOrigins = env.corsAllowedOrigins.length > 0
    ? env.corsAllowedOrigins
    : env.nodeEnv === "production"
      ? []
      : ["http://localhost:3000", "http://127.0.0.1:3000"];

  await app.register(cors, {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["content-type", "authorization", "x-request-id", "x-api-key"],
    exposedHeaders: ["x-request-id", "x-powerchain-api-version", "x-powerchain-quote-id", "x-powerchain-quote-hash", "x-powerchain-receipt-id"]
  });

  await app.register(swagger, {
    mode: "static",
    specification: {
      path: openApiPath,
      baseDir: openApiBaseDir
    }
  });
  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list", deepLinking: true }
  });
  await app.register(websocket, { options: { maxPayload: 64 * 1024 } });

  let creditReconcileTimer: ReturnType<typeof setInterval> | null = null;
  const reconcileStaleCredits = async (): Promise<void> => {
    const staleBefore = new Date(Date.now() - env.creditReservationRecoveryMs).toISOString();
    try {
      const released = await getStore().releaseStaleCreditReservations(staleBefore, 100);
      if (released > 0) app.log.warn({ released, staleBefore }, "released stale PWRC credit reservations");
    } catch (error) {
      app.log.error({ err: error, staleBefore }, "PWRC stale-reservation reconciliation failed");
    }
  };
  app.addHook("onReady", async () => {
    await reconcileStaleCredits();
    creditReconcileTimer = setInterval(() => { void reconcileStaleCredits(); }, env.creditReconcileIntervalMs);
    creditReconcileTimer.unref?.();
  });
  app.addHook("onClose", async () => {
    if (creditReconcileTimer) clearInterval(creditReconcileTimer);
    creditReconcileTimer = null;
  });

  app.addHook("onRequest", async (request, reply) => {
    if (request.method !== "OPTIONS" && (request.url.startsWith(`${API_PREFIX}/`) || request.url.startsWith(`${PUBLIC_API_PREFIX}/`))) requireApiKey(request);
    const context = createRequestContext(request);
    reply.header("x-request-id", context.requestId);
    reply.header("x-powerchain-api-version", APP_VERSION);
    reply.header("x-content-type-options", "nosniff");
    reply.header("referrer-policy", "strict-origin-when-cross-origin");
    reply.header("cache-control", "no-store");
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "request failed");
    if (error instanceof ApiError) return sendError(reply, error.message, error.status, error.code, request.id);
    const status = typeof error.statusCode === "number" && error.statusCode >= 400 ? error.statusCode : 500;
    const message = status >= 500 ? "Internal server error." : error.message;
    return sendError(reply, message, status, status >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR", request.id);
  });

  app.get("/", async () => ({
    name: "PowerChain Copilot API",
    version: APP_VERSION,
    api: API_PREFIX,
    publicApi: `${PUBLIC_API_ORIGIN}${PUBLIC_API_PREFIX}`,
    appGateway: `${APP_API_ORIGIN}${PUBLIC_API_PREFIX}`,
    docs: "/docs",
    openapi: "/docs/json",
    websocket: "/ws/v1"
  }));

  await registerApiV1(app, API_PREFIX);
  await registerApiV1(app, PUBLIC_API_PREFIX);
  await registerWebSocketRoutes(app);
  return app;
}
