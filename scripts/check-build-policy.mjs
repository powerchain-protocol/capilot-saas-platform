import { readFile } from "node:fs/promises";

const workspace = await readFile(new URL("../pnpm-workspace.yaml", import.meta.url), "utf8");
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

for (const required of [
  "overrides:",
  "unrs-resolver: 1.12.2",
  "strictDepBuilds: true",
  "allowBuilds:",
  "unrs-resolver: true",
  "sharp: true",
]) {
  if (!workspace.includes(required)) {
    console.error(`pnpm workspace policy is missing: ${required}`);
    process.exit(1);
  }
}

if (Object.hasOwn(pkg, "pnpm")) {
  console.error('package.json must not contain a top-level "pnpm" configuration block; pnpm 11 reads project settings from pnpm-workspace.yaml.');
  process.exit(1);
}

for (const deprecated of ["onlyBuiltDependencies:", "neverBuiltDependencies:", "ignoredBuiltDependencies:"]) {
  if (workspace.includes(deprecated)) {
    console.error(`Deprecated pnpm build policy found: ${deprecated}`);
    process.exit(1);
  }
}

console.log("pnpm policy OK: overrides/build trust are configured in pnpm-workspace.yaml.");
