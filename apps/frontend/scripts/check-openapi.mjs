import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const contractPath = path.resolve(root, "../../api/openapi/openapi.yaml");
const contract = await fs.readFile(contractPath, "utf8");
const documented = new Set([...contract.matchAll(/^  (\/[A-Za-z0-9_{}\-/.]+):\s*$/gm)].map((match) => match[1]));
const required = [
  "/api/v1/health",
  "/api/v1/auth/sign-in",
  "/api/v1/auth/register",
  "/api/v1/auth/demo",
  "/api/v1/auth/sign-out",
  "/api/v1/sessions/current",
  "/api/v1/sessions",
  "/api/v1/sessions/{id}",
  "/api/v1/security/session",
  "/api/v1/dashboard",
  "/api/v1/assets",
  "/api/v1/approvals",
  "/api/v1/approvals/{id}",
  "/api/v1/ai/generate",
  "/api/v1/chat",
  "/api/v1/chat/{id}",
  "/api/v1/chat/{id}/messages",
  "/api/v1/copilot",
  "/api/v1/messages/{id}",
  "/api/v1/profile",
  "/api/v1/services",
  "/api/v1/market/price",
  "/api/v1/network/solana",
  "/api/v1/contact",
  "/ws/v1/chat/{id}",
];
const missing = required.filter((route) => !documented.has(route));
if (missing.length) {
  console.error(`OpenAPI is missing canonical paths:\n${missing.map((route) => `- ${route}`).join("\n")}`);
  process.exit(1);
}
console.log(`OpenAPI coverage audit passed (${required.length} canonical HTTP/WebSocket paths documented).`);
