import { spawnSync } from "node:child_process";

const command = process.platform === "win32" ? "next.cmd" : "next";
const args = process.argv.slice(2);
const result = spawnSync(command, args, {
  stdio: "inherit",
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }
});

if (result.error) {
  console.error(result.error.message);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
