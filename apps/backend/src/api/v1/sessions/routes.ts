import type { FastifyInstance } from "fastify";
import { getStore } from "../../../store";
import { getRequestIp, maskIp } from "../../../context/request-context";
import { getAuthContext, requireAuth } from "../middlewares/auth";
import { clearSessionCookieValue } from "../middlewares/cookies";
import { sendError, sendOk } from "../middlewares/http";

export async function registerSessionRoutes(app: FastifyInstance): Promise<void> {
  app.get("/sessions/current", async (request, reply) => {
    const auth = await getAuthContext(request);
    if (!auth) return sendError(reply, "Not signed in.", 401, "UNAUTHENTICATED");
    return sendOk(reply, {
      session: auth.session,
      user: { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      workspace: auth.workspace,
      role: auth.role
    });
  });

  app.get("/sessions", async (request, reply) => {
    const auth = await requireAuth(request);
    const sessions = await getStore().listSessions(auth.user.id);
    return sendOk(reply, sessions.map((session) => ({ ...session, current: session.id === auth.session.id })));
  });

  app.delete<{ Params: { id: string } }>("/sessions/:id", async (request, reply) => {
    const auth = await requireAuth(request);
    const revoked = await getStore().revokeSession(request.params.id, auth.user.id);
    if (!revoked) return sendError(reply, "Session not found or already revoked.", 404, "SESSION_NOT_FOUND");
    if (request.params.id === auth.session.id) reply.header("set-cookie", clearSessionCookieValue());
    return sendOk(reply, { revoked: true, id: request.params.id });
  });

  app.get("/security/session", async (request, reply) => {
    const auth = await requireAuth(request);
    const query = request.query as Record<string, unknown>;
    const reveal = query.reveal === "1" || query.reveal === 1;
    const ip = getRequestIp(request);
    return sendOk(reply, {
      ip: reveal ? ip : maskIp(ip),
      masked: !reveal,
      role: auth.role,
      persistent: auth.session.persistent,
      expiresAt: auth.session.expiresAt,
      sessionId: auth.session.id
    });
  });
}
