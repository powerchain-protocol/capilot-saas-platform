import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { frontendRoot, monorepoRoot } from "./paths.mjs";

const required = [
  "apps/backend/src/api/v1/index.ts",
  "apps/backend/src/api/v1/auth/routes.ts",
  "apps/backend/src/api/v1/sessions/routes.ts",
  "apps/backend/src/api/v1/middlewares/auth.ts",
  "apps/backend/src/api/v1/ai/routes.ts",
  "apps/backend/src/api/v1/chat/routes.ts",
  "apps/backend/src/api/v1/messages/routes.ts",
  "apps/backend/src/api/v1/credits/routes.ts",
  "apps/backend/src/ws/routes.ts",
  "apps/backend/src/storage/postgres.ts",
  "supabase/migrations/20260827000100_initial.sql",
  "supabase/migrations/20260827000200_credits.sql",
  "supabase/migrations/20260827000300_credit_quotes_receipts.sql",
  "apps/frontend/app/api/v1/[...path]/route.ts",
  "apps/frontend/lib/powerchain/api.ts",
  "apps/frontend/lib/powerchain/endpoints.ts",
  "apps/frontend/lib/powerchain/fallbacks.ts",
  "apps/frontend/lib/powerchain/ws.ts",
  "api/openapi/openapi.yaml",
  "api/postman/PowerChain-Copilot.postman_collection.json",
];
const missing = required.filter((file) => !existsSync(join(monorepoRoot, file)));
if (missing.length) {
  console.error("Missing canonical API files:\n" + missing.map((file) => `- ${file}`).join("\n"));
  process.exit(1);
}
const endpoints = readFileSync(join(frontendRoot, "lib/powerchain/endpoints.ts"), "utf8");
if (!endpoints.includes('export const API_BASE = "/api/v1"')) {
  console.error("lib/powerchain/endpoints.ts must keep /api/v1 as the canonical browser API base.");
  process.exit(1);
}
console.log(`API/backend structure audit passed (${required.length} required files).`);
