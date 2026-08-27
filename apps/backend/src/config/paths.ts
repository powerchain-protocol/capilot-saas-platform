import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = dirname(fileURLToPath(import.meta.url));
export const backendRoot = resolve(configDir, "../..");
export const monorepoRoot = resolve(backendRoot, "../..");
export const migrationDir = resolve(monorepoRoot, "supabase/migrations");
export const openApiPath = resolve(monorepoRoot, "api/openapi/openapi.yaml");
export const openApiBaseDir = resolve(monorepoRoot, "api/openapi");
