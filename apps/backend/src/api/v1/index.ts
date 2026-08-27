import type { FastifyInstance } from "fastify";
import { API_PREFIX } from "../../constants/api.ts";
import { registerApprovalRoutes } from "./approvals/routes.ts";
import { registerAiRoutes } from "./ai/routes.ts";
import { registerAssetRoutes } from "./assets/routes.ts";
import { registerAuthRoutes } from "./auth/routes.ts";
import { registerChatRoutes } from "./chat/routes.ts";
import { registerContactRoutes } from "./contact/routes.ts";
import { registerCreditRoutes } from "./credits/routes.ts";
import { registerDashboardRoutes } from "./dashboard/routes.ts";
import { registerHealthRoutes } from "./health/routes.ts";
import { registerMarketRoutes } from "./market/routes.ts";
import { registerMessageRoutes } from "./messages/routes.ts";
import { registerNetworkRoutes } from "./network/routes.ts";
import { registerProfileRoutes } from "./profile/routes.ts";
import { registerServiceRoutes } from "./services/routes.ts";
import { registerSessionRoutes } from "./sessions/routes.ts";
import { registerTokenRoutes } from "./tokens/routes.ts";

export async function registerApiV1(app: FastifyInstance, prefix: string = API_PREFIX): Promise<void> {
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
    await registerCreditRoutes(v1);
    await registerTokenRoutes(v1);
  }, { prefix });
}
