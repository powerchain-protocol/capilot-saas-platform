import { env, isProduction } from "../config/env.ts";
import { MemoryStore } from "../storage/memory.ts";
import { PostgresStore } from "../storage/postgres.ts";
import type { Store } from "./types.ts";

let singleton: Store | null = null;

export function getStore(): Store {
  if (singleton) return singleton;
  if (env.databaseUrl) {
    singleton = new PostgresStore(env.databaseUrl);
    return singleton;
  }
  if (env.allowMemoryFallback && !isProduction) {
    singleton = new MemoryStore();
    return singleton;
  }
  throw new Error("No persistence adapter is configured. Set DATABASE_URL.");
}
