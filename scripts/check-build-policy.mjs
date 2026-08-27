import { readFile } from "node:fs/promises";

const workspace = await readFile(new URL("../pnpm-workspace.yaml", import.meta.url), "utf8");
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

const nvmrc = (await readFile(new URL("../.nvmrc", import.meta.url), "utf8")).trim();
const nodeVersionFile = (await readFile(new URL("../.node-version", import.meta.url), "utf8")).trim();
const frontendPkg = JSON.parse(await readFile(new URL("../apps/frontend/package.json", import.meta.url), "utf8"));
const backendPkg = JSON.parse(await readFile(new URL("../apps/backend/package.json", import.meta.url), "utf8"));

if (nvmrc !== "24.20.0" || nodeVersionFile !== nvmrc) {
  console.error(`Runtime files must agree on Node 24.20.0 (.nvmrc=${nvmrc}, .node-version=${nodeVersionFile}).`);
  process.exit(1);
}
if (pkg.packageManager !== "pnpm@11.24.0" || pkg.engines?.pnpm !== ">=11.24.0 <12") {
  console.error(`pnpm runtime must be pinned to pnpm@11.24.0 with engine >=11.24.0 <12; got ${pkg.packageManager} / ${pkg.engines?.pnpm}.`);
  process.exit(1);
}

for (const [name, manifest] of [["root", pkg], ["frontend", frontendPkg], ["backend", backendPkg]]) {
  if (manifest.engines?.node !== ">=24.19.0 <25") {
    console.error(`${name} Node engine must be >=24.19.0 <25; got ${manifest.engines?.node ?? "missing"}.`);
    process.exit(1);
  }
}

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

console.log("pnpm/runtime policy OK: workspace build trust and Node runtime files are consistent.");
