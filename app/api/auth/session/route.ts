import { getSessionContext } from "@/lib/server/auth";
import { fail, ok } from "@/lib/server/http";
export async function GET() {
  const ctx = await getSessionContext();
  if (!ctx) return fail("Not signed in.", 401, "UNAUTHENTICATED");
  return ok({
    user: { id: ctx.user.id, name: ctx.user.name, email: ctx.user.email },
    workspace: ctx.workspace,
    role: ctx.session.role,
    persistent: Boolean(ctx.session.persistent),
    expiresAt: new Date(ctx.session.exp).toISOString(),
  });
}
