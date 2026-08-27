import { apiSession, fail, ok } from "@/lib/server/http";import { listAssets } from "@/lib/server/repository";
export async function GET(){const s=await apiSession();if(!s)return fail("Sign in required.",401,"UNAUTHENTICATED");return ok(await listAssets(s.workspaceId));}
