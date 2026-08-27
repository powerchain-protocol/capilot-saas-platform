import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "apps/frontend/lib/utils/utils.ts",
  "apps/frontend/lib/powerchain/api.ts",
  "apps/frontend/lib/powerchain/endpoints.ts",
  "apps/frontend/lib/powerchain/fallbacks.ts",
  "apps/frontend/lib/powerchain/ws.ts",
  "apps/frontend/queries/queries.ts",
  "apps/frontend/hooks/media-queries.ts",
  "apps/frontend/lib/uploads.ts",
  "apps/frontend/context/session-context.tsx",
  "apps/frontend/constants/currencies.ts",
  "apps/frontend/storage/browser.ts",
  "apps/frontend/store/preferences.ts",
  "apps/frontend/data/explorers.ts",
  "apps/frontend/utils/epoch.ts",
  "apps/frontend/ai/providers.tsx",
  "apps/frontend/ai/generic/index.ts",
  "apps/frontend/ai/solana/index.ts",
  "apps/frontend/ai/powerchain/index.ts",
  "apps/frontend/components/common/cta.tsx",
  "apps/frontend/components/installer/mobile.tsx",
  "apps/frontend/components/installer/pwa.tsx",
  "apps/frontend/components/installer/pwa-register.tsx",
  "apps/frontend/integrations/pages/loading.tsx",
  "apps/frontend/integrations/pages/404.tsx",
  "apps/frontend/integrations/pages/not-found.tsx",
  "apps/frontend/integrations/pages/error.boundary.tsx",
  "apps/frontend/storage/index.ts",
  "apps/frontend/store/install-preferences.ts",
  "apps/frontend/components/ai/suggestions.tsx",
  "apps/frontend/components/chat/chat-skeleton.tsx",
  "apps/frontend/components/chat/chat-interface.tsx",
  "apps/frontend/components/chat/chat-settings.tsx",
  "apps/frontend/components/messages/saved-prompts.tsx",
  "apps/frontend/types/prompts.ts",
  "apps/frontend/types/messages.ts",
  "apps/frontend/types/actions/index.ts",
  "apps/dashboard/actions.json",
  "apps/backend/src/server.ts",
  "apps/backend/src/api/v1/index.ts",
  "apps/backend/src/api/v1/auth/routes.ts",
  "apps/backend/src/api/v1/sessions/routes.ts",
  "apps/backend/src/api/v1/middlewares/auth.ts",
  "apps/backend/src/api/v1/ai/routes.ts",
  "apps/backend/src/api/v1/chat/routes.ts",
  "apps/backend/src/api/v1/messages/routes.ts",
  "apps/backend/src/storage/postgres.ts",
  "apps/backend/src/storage/migrations/0001_initial.sql",
  "apps/backend/src/ws/routes.ts",
  "apps/backend/src/utils/health.ts",
  "apps/backend/src/constants/currencies.ts",
  "apps/backend/src/data/explorers.ts",
  "api/openapi/openapi.yaml",
  "api/postman/PowerChain-Copilot.postman_collection.json",
  "api/postman/environments/PowerChain-Local.postman_environment.json",
  "api/postman/datasets/smoke.json",
  "api/mocks/server.mjs",
  "api/asyncapi/asyncapi.yaml",
  "api/schemas/api-envelope.schema.json",
  "packages/sdk-typescript/src/client.ts",
  "packages/sdk-typescript/src/websocket.ts",
  "vercel.json",
];

async function walk(directory) {
  const output = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (["node_modules", ".next", ".turbo", "dist", "build"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(absolute));
    else output.push(absolute);
  }
  return output;
}

const missing = [];
for (const file of required) {
  try { await fs.access(path.join(root, file)); }
  catch { missing.push(file); }
}

const sourceFiles = (await Promise.all(["apps", "packages"].map((directory) => walk(path.join(root, directory))))
  .then((groups) => groups.flat()))
  .filter((file) => /\.(ts|tsx)$/.test(file));

const explicitAny = [];
const anyPatterns = [
  /:\s*any\b/,
  /\bas\s+any\b/,
  /<\s*any\s*>/,
  /\bany\s*\[\s*\]/,
  /\bArray\s*<\s*any\s*>/,
  /\bPromise\s*<\s*any\s*>/,
  /\bRecord\s*<[^>]*,\s*any\s*>/,
];
for (const file of sourceFiles) {
  const text = await fs.readFile(file, "utf8");
  for (const [index, line] of text.split("\n").entries()) {
    if (!anyPatterns.some((pattern) => pattern.test(line))) continue;
    explicitAny.push(`${path.relative(root, file)}:${index + 1}: ${line.trim()}`);
  }
}

if (missing.length || explicitAny.length) {
  if (missing.length) console.error("Missing required architecture files:\n" + missing.map((file) => `- ${file}`).join("\n"));
  if (explicitAny.length) console.error("Explicit any/source violations:\n" + explicitAny.join("\n"));
  process.exit(1);
}

console.log(`Source architecture audit passed (${sourceFiles.length} TS/TSX files, no explicit any violations).`);
