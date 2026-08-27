import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
export const frontendRoot = path.resolve(scriptsDir, "..");
export const monorepoRoot = path.resolve(frontendRoot, "../..");
export const appRoot = path.join(frontendRoot, "app");
export const publicRoot = path.join(frontendRoot, "public");
export const dashboardRoot = path.join(monorepoRoot, "apps/dashboard");
