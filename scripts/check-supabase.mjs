import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (relative) => JSON.parse(await readFile(path.join(root, relative), "utf8"));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

for (const required of ["supabase/config.toml", "supabase/migrations", "packages/supabase/package.json", "apps/backend/turbo.json", "apps/frontend/turbo.json"]) {
  await access(path.join(root, required));
}

const turbo = await readJson("turbo.json");
const globalEnv = new Set(turbo.globalEnv ?? []);
for (const name of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]) {
  assert(globalEnv.has(name), `turbo.json globalEnv is missing public Supabase variable ${name}.`);
}
for (const secret of ["SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY", "DATABASE_URL", "DIRECT_URL"]) {
  assert(!globalEnv.has(secret), `${secret} must not be global Turbo environment state.`);
}

const backendTurbo = await readJson("apps/backend/turbo.json");
const backendEnv = new Set(backendTurbo.tasks?.dev?.env ?? []);
for (const name of ["DATABASE_URL", "DIRECT_URL", "SUPABASE_URL", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY"]) {
  assert(backendEnv.has(name), `Backend Turbo env allowlist is missing ${name}.`);
}

const frontendTurbo = await readJson("apps/frontend/turbo.json");
const frontendEnv = new Set(frontendTurbo.tasks?.build?.env ?? []);
for (const secret of ["SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY", "DATABASE_URL", "DIRECT_URL"]) {
  assert(!frontendEnv.has(secret), `Frontend Turbo env must not expose ${secret}.`);
}

const migrations = (await readdir(path.join(root, "supabase/migrations"))).filter((name) => name.endsWith(".sql")).sort();
assert(migrations.length >= 3, "Supabase migration directory must contain the canonical schema migrations.");
assert(migrations.every((name) => /^\d{14}_.+\.sql$/.test(name)), "Supabase migration names must use 14-digit timestamp prefixes.");

try {
  await access(path.join(root, "apps/backend/src/storage/migrations"));
  throw new Error("Legacy backend migration directory still exists; migrations must have one canonical owner under supabase/migrations.");
} catch (error) {
  if (error instanceof Error && error.message.startsWith("Legacy backend")) throw error;
}

const supabasePkg = await readJson("packages/supabase/package.json");
assert(supabasePkg.dependencies?.["@supabase/supabase-js"] === "2.112.4", "@supabase/supabase-js must remain pinned for reproducible builds.");

console.log(`Supabase/Turbo audit passed (${migrations.length} canonical migrations; private keys isolated from global/frontend env).`);
