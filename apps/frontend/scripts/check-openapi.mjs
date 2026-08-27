import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const contractPath = path.resolve(root, "../../api/openapi/openapi.yaml");
const contract = await fs.readFile(contractPath, "utf8");
const documented = new Set([...contract.matchAll(/^  (\/[A-Za-z0-9_{}\-/.]+):\s*$/gm)].map((match) => match[1]));
const required = [
  "/v1/health",
  "/v1/auth/sign-in",
  "/v1/auth/register",
  "/v1/auth/demo",
  "/v1/auth/sign-out",
  "/v1/sessions/current",
  "/v1/sessions",
  "/v1/sessions/{id}",
  "/v1/security/session",
  "/v1/dashboard",
  "/v1/assets",
  "/v1/approvals",
  "/v1/approvals/{id}",
  "/v1/ai/generate",
  "/v1/chat",
  "/v1/chat/{id}",
  "/v1/chat/{id}/messages",
  "/v1/copilot",
  "/v1/messages/{id}",
  "/v1/profile",
  "/v1/services",
  "/v1/market/price",
  "/v1/network/solana",
  "/v1/contact",
  "/v1/credits",
  "/v1/credits/ledger",
  "/v1/tokens",
  "/v1/tokens/pwrc",
  "/ws/v1/chat/{id}",
];
const missing = required.filter((route) => !documented.has(route));
if (missing.length) {
  console.error(`OpenAPI is missing canonical paths:\n${missing.map((route) => `- ${route}`).join("\n")}`);
  process.exit(1);
}
console.log(`OpenAPI coverage audit passed (${required.length} canonical HTTP/WebSocket paths documented).`);
