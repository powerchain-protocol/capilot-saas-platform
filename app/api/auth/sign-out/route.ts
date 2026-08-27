import { clearSessionCookie } from "@/lib/server/auth";import { fail, ok } from "@/lib/server/http";import { sameOrigin } from "@/lib/server/security";
export async function POST(req:Request){if(!sameOrigin(req))return fail("Cross-origin mutation rejected.",403,"ORIGIN_REJECTED");await clearSessionCookie();return ok({signedOut:true});}
