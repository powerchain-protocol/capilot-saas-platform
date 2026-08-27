import { promises as fs } from "node:fs";
import path from "node:path";
import type { AppState } from "@/lib/types/domain";

const file = path.join(process.cwd(), ".data", "powerchain-saas.json");
const emptyState: AppState = { users: [], workspaces: [], memberships: [], assets: [], approvals: [], activities: [], messages: [], contacts: [] };

let writeQueue = Promise.resolve();

async function ensure() {
  await fs.mkdir(path.dirname(file), { recursive: true });
  try { await fs.access(file); } catch { await fs.writeFile(file, JSON.stringify(emptyState, null, 2), "utf8"); }
}

export async function readLocalState(): Promise<AppState> {
  await ensure();
  try { return JSON.parse(await fs.readFile(file, "utf8")) as AppState; }
  catch { return structuredClone(emptyState); }
}

export async function mutateLocalState<T>(fn: (state: AppState) => T | Promise<T>): Promise<T> {
  let result!: T;
  writeQueue = writeQueue.catch(()=>undefined).then(async () => {
    const state = await readLocalState();
    result = await fn(state);
    await fs.writeFile(file, JSON.stringify(state, null, 2), "utf8");
  });
  await writeQueue;
  return result;
}
