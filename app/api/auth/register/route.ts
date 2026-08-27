import { createSession, setSessionCookie } from "@/lib/server/auth";
import { hashPassword, validatePassword } from "@/lib/server/crypto";
import { fail, jsonBody, ok } from "@/lib/server/http";
import { createAccount, findUserByEmail, recordLegalAcceptance } from "@/lib/server/repository";
import type { Plan } from "@/lib/types/domain";
import { allowRequest, sameOrigin } from "@/lib/server/security";
import { LEGAL_VERSION } from "@/data/legal";
import { asBoolean, sanitizeText } from "@/utils/helpers";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Cross-origin mutation rejected.", 403, "ORIGIN_REJECTED");
  if (!allowRequest(req, "register", 10, 60_000)) return fail("Too many requests. Try again shortly.", 429, "RATE_LIMITED");
  const body = await jsonBody<{ name?: string; email?: string; password?: string; workspaceName?: string; plan?: Plan; acceptedTerms?: boolean }>(req);
  const name = sanitizeText(body?.name, 120);
  const email = sanitizeText(body?.email, 320).toLowerCase();
  const password = String(body?.password || "");
  const workspaceName = sanitizeText(body?.workspaceName, 160);
  const plan = (body?.plan || "free") as Plan;
  if (name.length < 2 || !email.includes("@") || workspaceName.length < 2) return fail("Name, work email, and workspace name are required.", 422, "VALIDATION");
  if (!asBoolean(body?.acceptedTerms)) return fail("Accept the Terms of Service to create an account.", 422, "TERMS_REQUIRED");
  if (!validatePassword(password)) return fail("Password must be at least 12 characters and include uppercase, lowercase, and a number.", 422, "WEAK_PASSWORD");
  if (await findUserByEmail(email)) return fail("An account already exists for this email.", 409, "ACCOUNT_EXISTS");
  const account = await createAccount({ name, email, passwordHash: hashPassword(password), workspaceName, plan: ["free", "pro", "business"].includes(plan) ? plan : "free" });
  await recordLegalAcceptance(account.user.id, LEGAL_VERSION);
  await setSessionCookie(createSession(account.user.id, account.workspace.id, account.role));
  return ok({ user: { id: account.user.id, email: account.user.email, name: account.user.name }, workspace: account.workspace }, 201);
}
