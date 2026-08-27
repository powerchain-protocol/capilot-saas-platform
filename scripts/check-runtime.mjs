const [major, minor, patch] = process.versions.node.split(".").map(Number);
const supported = major === 24 && (minor > 19 || (minor === 19 && patch >= 0));
const recommended = major === 24 && (minor > 20 || (minor === 20 && patch >= 0));

if (!supported) {
  console.error(`PowerChain Copilot supports Node >=24.19.0 <25. Current: ${process.versions.node}`);
  console.error("Recommended runtime: Node 24.20.0 LTS from .nvmrc.");
  console.error("Run: nvm install 24.20.0 && nvm use 24.20.0");
  process.exit(1);
}

if (!recommended) {
  console.warn(`Runtime supported: Node ${process.versions.node}. Recommended: Node 24.20.0 LTS (run: nvm install && nvm use).`);
} else {
  console.log(`Runtime OK: Node ${process.versions.node}`);
}
