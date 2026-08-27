import type { FastifyInstance } from "fastify";
import { getStore } from "../../../store/index.ts";
import { requireAuth } from "../middlewares/auth.ts";
import { sendOk } from "../middlewares/http.ts";

export async function registerDashboardRoutes(app: FastifyInstance): Promise<void> {
  app.get("/dashboard", async (request, reply) => {
    const auth = await requireAuth(request);
    const store = getStore();
    const [assets, approvals, activities, credits] = await Promise.all([
      store.listAssets(auth.workspace.id),
      store.listApprovals(auth.workspace.id),
      store.listActivities(auth.workspace.id, 8),
      store.getCreditAccount(auth.workspace.id, auth.user.id)
    ]);
    const capacity = assets.reduce((sum, asset) => sum + asset.capacityMw, 0);
    const availability = assets.length ? assets.reduce((sum, asset) => sum + asset.availability, 0) / assets.length : 0;
    return sendOk(reply, {
      user: { name: auth.user.name, email: auth.user.email },
      workspace: auth.workspace,
      metrics: {
        assets: assets.length,
        capacityMw: capacity,
        availability: Number(availability.toFixed(1)),
        verifiedAssets: assets.filter((asset) => asset.verified).length,
        pendingApprovals: approvals.filter((approval) => approval.status === "pending").length,
        pwrcAvailable: credits.available
      },
      assets: assets.slice(0, 4),
      approvals: approvals.slice(0, 4),
      activities
    });
  });
}
