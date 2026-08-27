import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession, verifySessionToken } from "./crypto";
import { findUserById, getWorkspace } from "./repository";
import type { Role, Session } from "@/lib/types/domain";

const COOKIE = "pc_session";

export function createSession(userId:string,workspaceId:string,role:Role):Session { return {userId,workspaceId,role,exp:Date.now()+1000*60*60*24*7}; }

export async function setSessionCookie(session:Session) {
  const store=await cookies();
  store.set(COOKIE,signSession(session),{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*24*7});
}

export async function clearSessionCookie(){const store=await cookies();store.set(COOKIE,"",{httpOnly:true,path:"/",maxAge:0,sameSite:"lax",secure:process.env.NODE_ENV==="production"});}

export async function getSession(){const store=await cookies();return verifySessionToken(store.get(COOKIE)?.value);}

export async function requireSession(){const session=await getSession();if(!session)redirect("/sign-in?next=/dashboard");return session;}

export async function getSessionContext(){const session=await getSession();if(!session)return null;const [user,workspace]=await Promise.all([findUserById(session.userId),getWorkspace(session.workspaceId)]);if(!user||!workspace)return null;return {session,user,workspace};}
