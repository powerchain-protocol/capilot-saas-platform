import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const targets = [".turbo", "node_modules/.cache"];
await Promise.all(targets.map((target) => rm(resolve(target), { recursive: true, force: true })));
console.log("Workspace caches removed.");
