import type { FastifyInstance } from "fastify";
import { API_PREFIX } from "../../constants/api";
import { registerApprovalRoutes } from "./approvals/routes";
import { registerAiRoutes } from "./ai/routes";
import { registerAssetRoutes } from "./assets/routes";
import { registerAuthRoutes } from "./auth/routes";
import { registerChatRoutes } from "./chat/routes";
import { registerContactRoutes } from "./contact/routes";
import { registerDashboardRoutes } from "./dashboard/routes";
import { registerHealthRoutes } from "./health/routes";
import { registerMarketRoutes } from "./market/routes";
import { registerMessageRoutes } from "./messages/routes";
import { registerNetworkRoutes } from "./network/routes";
import { registerProfileRoutes } from "./profile/routes";
import { registerServiceRoutes } from "./services/routes";
import { registerSessionRoutes } from "./sessions/routes";

export async function registerApiV1(app: FastifyInstance): Promise<void> {
  await app.register(async (v1) => {
    await registerHealthRoutes(v1);
    await registerAuthRoutes(v1);
    await registerSessionRoutes(v1);
    await registerDashboardRoutes(v1);
    await registerAssetRoutes(v1);
    await registerApprovalRoutes(v1);
    await registerProfileRoutes(v1);
    await registerContactRoutes(v1);
    await registerServiceRoutes(v1);
    await registerMarketRoutes(v1);
    await registerNetworkRoutes(v1);
    await registerAiRoutes(v1);
    await registerChatRoutes(v1);
    await registerMessageRoutes(v1);
  }, { prefix: API_PREFIX });
}
