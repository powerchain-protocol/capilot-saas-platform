import { readFile } from "node:fs/promises";

const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const [major, minor] = process.versions.node.split(".").map(Number);
const supported = major === 24 && minor >= 19;

if (!supported) {
  console.error(`PowerChain Copilot supports Node >=24.19.0 <25. Current: ${process.versions.node}.`);
  console.error("Recommended: nvm install 24.20.0 && nvm use 24.20.0");
  process.exit(1);
}

console.log(`Node: ${process.versions.node} (supported; .nvmrc recommends 24.20.0 LTS)`);
console.log(`Package manager: ${pkg.packageManager}`);
console.log("pnpm project settings live in pnpm-workspace.yaml; package.json does not contain a deprecated pnpm config block.");
console.log("If pnpm is unavailable: npm install -g corepack@latest && corepack enable && corepack install --global pnpm@11.24.0");
