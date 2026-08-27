const [major = 0, minor = 0] = process.versions.node.split(".").map(Number);
const validNode = major > 24 || (major === 24 && minor >= 20);
if (!validNode) {
  console.error(`PowerChain Copilot requires Node >=24.20.0. Current: ${process.versions.node}. Run: nvm use`);
  process.exit(1);
}
console.log(`Node ${process.versions.node} is compatible.`);
console.log("Run `corepack enable`, activate pnpm 11.23.0, then `pnpm install`.");
