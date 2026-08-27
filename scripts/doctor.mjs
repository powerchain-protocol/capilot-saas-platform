const [major = 0, minor = 0, patch = 0] = process.versions.node.split(".").map(Number);
const validNode = major === 24 && (minor > 20 || (minor === 20 && patch >= 0));
if (!validNode) {
  console.error(`PowerChain Copilot requires Node >=24.20.0 <25. Current: ${process.versions.node}. Run: nvm install && nvm use`);
  process.exit(1);
}
console.log(`Node ${process.versions.node} is compatible.`);
console.log("pnpm 11.23.0 is pinned through packageManager; run `corepack enable` then `pnpm install`.");
