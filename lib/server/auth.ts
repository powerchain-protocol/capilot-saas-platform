import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession, verifySessionToken } from "./crypto";
import { findUserById, getWorkspace } from "./repository";
import type { Role, Session } from "@/lib/types/domain";

const COOKIE = "pc_session";
const STANDARD_SESSION_MS = 1000 * 60 * 60 * 12;
const REMEMBERED_SESSION_MS = 1000 * 60 * 60 * 24 * 30;

export function createSession(userId: string, workspaceId: string, role: Role, persistent = false): Session {
  return { userId, workspaceId, role, persistent, exp: Date.now() + (persistent ? REMEMBERED_SESSION_MS : STANDARD_SESSION_MS) };
}

export async function setSessionCookie(session: Session) {
  const store = await cookies();
  const baseOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    priority: "high" as const,
  };
  const token = signSession(session);
  if (session.persistent) {
    store.set(COOKIE, token, { ...baseOptions, maxAge: Math.max(1, Math.floor((session.exp - Date.now()) / 1000)) });
    return;
  }
  store.set(COOKIE, token, baseOptions);
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
}

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/dashboard");
  return session;
}

export async function getSessionContext() {
  const session = await getSession();
  if (!session) return null;
  const [user, workspace] = await Promise.all([findUserById(session.userId), getWorkspace(session.workspaceId)]);
  if (!user || !workspace) return null;
  return { session, user, workspace };
}
