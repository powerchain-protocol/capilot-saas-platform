import { createSession, setSessionCookie } from "@/lib/server/auth";
import { hashPassword } from "@/lib/server/crypto";
import { fail, ok } from "@/lib/server/http";
import { ensureDemoAccount } from "@/lib/server/repository";
import { allowRequest, sameOrigin } from "@/lib/server/security";
export async function POST(req:Request){if(!sameOrigin(req))return fail("Cross-origin mutation rejected.",403,"ORIGIN_REJECTED");if(!allowRequest(req,"demo",20,60_000))return fail("Too many requests. Try again shortly.",429,"RATE_LIMITED");const a=await ensureDemoAccount(hashPassword(`Demo-${Date.now()}-A1`));await setSessionCookie(createSession(a.user.id,a.workspace.id,a.role));return ok({user:{id:a.user.id,name:a.user.name,email:a.user.email},workspace:a.workspace});}
