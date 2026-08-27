import { spawn } from "node:child_process";

const [task, ...args] = process.argv.slice(2);
if (!task) {
  console.error("Usage: node scripts/turbo-runner.mjs <task> [...args]");
  process.exit(1);
}

const executable = process.platform === "win32" ? "turbo.cmd" : "turbo";
const child = spawn(executable, [task, ...args], {
  stdio: "inherit",
  env: process.env,
});

child.once("error", (error) => {
  console.error(`Unable to start Turborepo: ${error.message}`);
  process.exitCode = 1;
});

child.once("exit", (code, signal) => {
  if (signal) {
    console.error(`Turborepo terminated by ${signal}.`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
