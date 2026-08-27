const requiredMajor = 24;
const requiredMinor = 20;
const requiredPatch = 0;
const [major, minor, patch] = process.versions.node.split(".").map(Number);
const ok = major === requiredMajor && (minor > requiredMinor || (minor === requiredMinor && patch >= requiredPatch));
if (!ok) {
  console.error(`PowerChain Copilot requires Node ${requiredMajor}.${requiredMinor}.${requiredPatch}+ on the Node ${requiredMajor} LTS line. Current: ${process.versions.node}`);
  console.error("Run: nvm install && nvm use");
  process.exit(1);
}
console.log(`Runtime OK: Node ${process.versions.node}`);
