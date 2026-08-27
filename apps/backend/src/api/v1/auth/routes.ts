import type { FastifyInstance, FastifyRequest } from "fastify";
import { getStore } from "../../../store";
import type { Plan } from "../../../store/types";
import { createId } from "../../../utils/ids";
import { hashPassword, signSessionToken, validatePassword, verifyPassword } from "../../../utils/crypto";
import { REMEMBERED_SESSION_MS, STANDARD_SESSION_MS } from "../../../constants/api";
import { clearSessionCookieValue, sessionCookieValue } from "../middlewares/cookies";
import { getAuthContext } from "../middlewares/auth";
import { asBoolean, sanitizeText, sendError, sendOk } from "../middlewares/http";
import { rateLimit, sameOriginOrAllowed } from "../middlewares/security";

function bodyRecord(request: FastifyRequest): Record<string, unknown> {
  return typeof request.body === "object" && request.body !== null ? request.body as Record<string, unknown> : {};
}

async function issueSession(reply: Parameters<typeof sendOk>[0], input: { userId: string; workspaceId: string; role: "owner" | "admin" | "operator" | "analyst" | "viewer"; persistent: boolean }) {
  const store = getStore();
  const duration = input.persistent ? REMEMBERED_SESSION_MS : STANDARD_SESSION_MS;
  const sid = createId("ses");
  const exp = Date.now() + duration;
  await store.createSession({ id: sid, userId: input.userId, workspaceId: input.workspaceId, role: input.role, persistent: input.persistent, expiresAt: new Date(exp).toISOString() });
  const token = signSessionToken({ sid, userId: input.userId, workspaceId: input.workspaceId, role: input.role, persistent: input.persistent, exp });
  reply.header("set-cookie", sessionCookieValue(token, input.persistent ? Math.floor(duration / 1000) : undefined));
  return sid;
}

export async function registerAuthRoutes(app: FastifyInstance): Promise<void> {
  app.post("/auth/sign-in", async (request, reply) => {
    if (!sameOriginOrAllowed(request)) return sendError(reply, "Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
    if (!rateLimit(request, "sign-in", 20, 60_000)) return sendError(reply, "Too many requests. Try again shortly.", 429, "RATE_LIMITED");
    const body = bodyRecord(request);
    const email = sanitizeText(body.email, 320).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";
    const rememberMe = asBoolean(body.rememberMe);
    const store = getStore();
    const user = await store.findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) return sendError(reply, "Invalid email or password.", 401, "INVALID_CREDENTIALS");
    const membership = await store.getMembershipForUser(user.id);
    if (!membership) return sendError(reply, "No workspace membership was found.", 403, "NO_WORKSPACE");
    const workspace = await store.getWorkspace(membership.workspaceId);
    if (!workspace) return sendError(reply, "Workspace not found.", 404, "WORKSPACE_NOT_FOUND");
    const sessionId = await issueSession(reply, { userId: user.id, workspaceId: workspace.id, role: membership.role, persistent: rememberMe });
    return sendOk(reply, { user: { id: user.id, email: user.email, name: user.name }, workspace, role: membership.role, sessionId, rememberMe });
  });

  app.post("/auth/register", async (request, reply) => {
    if (!sameOriginOrAllowed(request)) return sendError(reply, "Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
    if (!rateLimit(request, "register", 10, 60_000)) return sendError(reply, "Too many requests. Try again shortly.", 429, "RATE_LIMITED");
    const body = bodyRecord(request);
    const name = sanitizeText(body.name, 120);
    const email = sanitizeText(body.email, 320).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";
    const workspaceName = sanitizeText(body.workspaceName, 160);
    const requestedPlan = sanitizeText(body.plan, 24);
    const plan: Plan = requestedPlan === "pro" || requestedPlan === "business" ? requestedPlan : "free";
    if (name.length < 2 || !email.includes("@") || workspaceName.length < 2) return sendError(reply, "Name, work email, and workspace name are required.", 422, "VALIDATION");
    if (!asBoolean(body.acceptedTerms)) return sendError(reply, "Accept the Terms of Service to create an account.", 422, "TERMS_REQUIRED");
    if (!validatePassword(password)) return sendError(reply, "Password must be at least 12 characters and include uppercase, lowercase, and a number.", 422, "WEAK_PASSWORD");
    const store = getStore();
    if (await store.findUserByEmail(email)) return sendError(reply, "An account already exists for this email.", 409, "ACCOUNT_EXISTS");
    const account = await store.createAccount({ name, email, passwordHash: hashPassword(password), workspaceName, plan });
    const sessionId = await issueSession(reply, { userId: account.user.id, workspaceId: account.workspace.id, role: account.membership.role, persistent: false });
    return sendOk(reply, { user: { id: account.user.id, email: account.user.email, name: account.user.name }, workspace: account.workspace, role: account.membership.role, sessionId }, 201);
  });

  app.post("/auth/demo", async (request, reply) => {
    if (!sameOriginOrAllowed(request)) return sendError(reply, "Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
    if (!rateLimit(request, "demo", 20, 60_000)) return sendError(reply, "Too many requests. Try again shortly.", 429, "RATE_LIMITED");
    const account = await getStore().ensureDemoAccount(hashPassword(`Demo-${Date.now()}-A1`));
    const sessionId = await issueSession(reply, { userId: account.user.id, workspaceId: account.workspace.id, role: account.membership.role, persistent: false });
    return sendOk(reply, { user: { id: account.user.id, name: account.user.name, email: account.user.email }, workspace: account.workspace, role: account.membership.role, sessionId });
  });

  app.post("/auth/sign-out", async (request, reply) => {
    if (!sameOriginOrAllowed(request)) return sendError(reply, "Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
    const auth = await getAuthContext(request);
    if (auth) await getStore().revokeSession(auth.session.id, auth.user.id);
    reply.header("set-cookie", clearSessionCookieValue());
    return sendOk(reply, { signedOut: true });
  });
}
