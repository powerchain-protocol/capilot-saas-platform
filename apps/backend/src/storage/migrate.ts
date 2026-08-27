import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Pool } from "pg";
import { env } from "../config/env";

async function main(): Promise<void> {
  if (!env.databaseUrl) throw new Error("DATABASE_URL is required to run PostgreSQL migrations.");
  const migrationPath = resolve(process.cwd(), "src/storage/migrations/0001_initial.sql");
  const sql = await readFile(migrationPath, "utf8");
  const pool = new Pool({ connectionString: env.databaseUrl, max: 1, connectionTimeoutMillis: 5_000 });
  try {
    await pool.query(sql);
    console.log("PowerChain Copilot PostgreSQL migration 0001_initial applied successfully.");
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown migration failure.";
  console.error(`Migration failed: ${message}`);
  process.exitCode = 1;
});
