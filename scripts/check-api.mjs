import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const required = [
  "app/api/v1/health/route.ts",
  "app/api/v1/dashboard/route.ts",
  "app/api/v1/assets/route.ts",
  "app/api/v1/approvals/route.ts",
  "app/api/v1/copilot/route.ts",
  "app/api/v1/profile/route.ts",
  "app/api/v1/services/route.ts",
  "app/api/v1/market/price/route.ts",
  "app/api/v1/network/solana/route.ts",
  "app/api/v1/security/session/route.ts",
  "apps/frontend/api/v1/client.ts",
  "cors/policy.ts",
  "lib/cache.ts",
  "lib/safe-actions.ts",
  "lib/pyth.ts",
  "lib/birdeye.ts",
  "lib/helius.ts",
  "lib/rpc.ts",
];

const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error("Missing canonical API files:\n" + missing.map((file) => `- ${file}`).join("\n"));
  process.exit(1);
}

const apiConfig = readFileSync(join(root, "config/api.ts"), "utf8");
if (!apiConfig.includes('export const API_BASE = "/api/v1"')) {
  console.error("config/api.ts must keep /api/v1 as the canonical browser API base.");
  process.exit(1);
}

console.log(`API v1 structure audit passed (${required.length} required files).`);
