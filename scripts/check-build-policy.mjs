import { readFile } from "node:fs/promises";

const workspace = await readFile(new URL("../pnpm-workspace.yaml", import.meta.url), "utf8");
for (const required of ["strictDepBuilds: true", "allowBuilds:", "unrs-resolver: true", "sharp: true"]) {
  if (!workspace.includes(required)) {
    console.error(`pnpm build policy is missing: ${required}`);
    process.exit(1);
  }
}
for (const deprecated of ["onlyBuiltDependencies:", "neverBuiltDependencies:", "ignoredBuiltDependencies:"]) {
  if (workspace.includes(deprecated)) {
    console.error(`Deprecated pnpm build policy found: ${deprecated}`);
    process.exit(1);
  }
}
console.log("pnpm build policy OK: strict allowBuilds approves unrs-resolver and sharp only.");
