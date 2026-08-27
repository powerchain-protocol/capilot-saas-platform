import type { FastifyReply, FastifyRequest } from "fastify";
import { SESSION_COOKIE } from "../../../constants/api";
import { getStore } from "../../../store";
import type { Role, SessionRecord, User, Workspace } from "../../../store/types";
import { verifySessionToken } from "../../../utils/crypto";
import { parseCookies } from "./cookies";
import { ApiError } from "./http";

export type AuthContext = {
  session: SessionRecord;
  user: User;
  workspace: Workspace;
  role: Role;
};

export async function getAuthContext(request: FastifyRequest): Promise<AuthContext | null> {
  const cookies = parseCookies(request.headers.cookie);
  const payload = verifySessionToken(cookies[SESSION_COOKIE]);
  if (!payload) return null;
  const store = getStore();
  const session = await store.getSession(payload.sid);
  if (!session || session.revokedAt || Date.parse(session.expiresAt) <= Date.now()) return null;
  if (session.userId !== payload.userId || session.workspaceId !== payload.workspaceId || session.role !== payload.role) return null;
  const [user, workspace] = await Promise.all([store.findUserById(session.userId), store.getWorkspace(session.workspaceId)]);
  if (!user || !workspace) return null;
  void store.touchSession(session.id);
  return { session, user, workspace, role: session.role };
}

export async function requireAuth(request: FastifyRequest, _reply?: FastifyReply): Promise<AuthContext> {
  const auth = await getAuthContext(request);
  if (!auth) throw new ApiError("Sign in required.", { status: 401, code: "UNAUTHENTICATED" });
  return auth;
}

export function requireRole(auth: AuthContext, allowed: readonly Role[]): void {
  if (!allowed.includes(auth.role)) throw new ApiError("Your role cannot perform this action.", { status: 403, code: "FORBIDDEN" });
}
