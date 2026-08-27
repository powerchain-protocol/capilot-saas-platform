import { resolve } from "node:path";
import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import websocket from "@fastify/websocket";
import { env, assertProductionConfiguration } from "./config/env";
import { registerApiV1 } from "./api/v1";
import { registerWebSocketRoutes } from "./ws/routes";
import { ApiError, sendError } from "./api/v1/middlewares/http";
import { createRequestContext } from "./context/request-context";

export async function buildServer(): Promise<FastifyInstance> {
  assertProductionConfiguration();
  const app = Fastify({
    logger: {
      level: env.nodeEnv === "production" ? "info" : "debug",
      redact: ["req.headers.authorization", "req.headers.cookie", "res.headers.set-cookie"]
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
    allowedHeaders: ["content-type", "authorization", "x-request-id"],
    exposedHeaders: ["x-request-id"]
  });

  await app.register(swagger, {
    mode: "static",
    specification: {
      path: resolve(process.cwd(), "../../api/openapi/openapi.yaml"),
      baseDir: resolve(process.cwd(), "../../api/openapi")
    }
  });
  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list", deepLinking: true }
  });
  await app.register(websocket, { options: { maxPayload: 64 * 1024 } });

  app.addHook("onRequest", async (request, reply) => {
    const context = createRequestContext(request);
    reply.header("x-request-id", context.requestId);
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
    version: "1.0.0",
    api: "/api/v1",
    docs: "/docs",
    openapi: "/docs/json",
    websocket: "/ws/v1"
  }));

  await registerApiV1(app);
  await registerWebSocketRoutes(app);
  return app;
}
