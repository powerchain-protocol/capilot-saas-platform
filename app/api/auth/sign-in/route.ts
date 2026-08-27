import { createSession, setSessionCookie } from "@/lib/server/auth";
import { verifyPassword } from "@/lib/server/crypto";
import { fail, jsonBody, ok } from "@/lib/server/http";
import { findUserByEmail, getMembershipForUser, getWorkspace } from "@/lib/server/repository";
import { allowRequest, sameOrigin } from "@/lib/server/security";
import { asBoolean, sanitizeText } from "@/utils/helpers";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
  if (!allowRequest(req, "sign-in", 20, 60_000)) return fail("Too many requests. Try again shortly.", 429, "RATE_LIMITED");
  const body = await jsonBody<{ email?: string; password?: string; rememberMe?: boolean }>(req);
  const email = sanitizeText(body?.email, 320).toLowerCase();
  const password = String(body?.password || "");
  const rememberMe = asBoolean(body?.rememberMe);
  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) return fail("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  const membership = await getMembershipForUser(user.id);
  if (!membership) return fail("No workspace membership was found.", 403, "NO_WORKSPACE");
  const workspace = await getWorkspace(membership.workspaceId);
  if (!workspace) return fail("Workspace not found.", 404, "WORKSPACE_NOT_FOUND");
  await setSessionCookie(createSession(user.id, workspace.id, membership.role, rememberMe));
  return ok({ user: { id: user.id, email: user.email, name: user.name }, workspace, rememberMe });
}
