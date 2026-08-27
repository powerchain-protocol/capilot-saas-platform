import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Pool } from "pg";
import { env } from "../config/env.ts";
import { migrationDir } from "../config/paths.ts";

async function main(): Promise<void> {
  const migrationUrl = env.directDatabaseUrl || env.databaseUrl;
  if (!migrationUrl) throw new Error("DIRECT_URL or DATABASE_URL is required to run PostgreSQL migrations.");
  const files = (await readdir(migrationDir)).filter((file) => /^\d+_.+\.sql$/.test(file)).sort();
  if (files.length === 0) throw new Error("No PostgreSQL migrations were found.");
  const pool = new Pool({ connectionString: migrationUrl, max: 1, connectionTimeoutMillis: 10_000, application_name: "powerchain-copilot-migrations" });
  try {
    for (const file of files) {
      const sql = await readFile(resolve(migrationDir, file), "utf8");
      await pool.query(sql);
      console.log(`Applied ${file}.`);
    }
    console.log(`PowerChain Copilot PostgreSQL migrations applied successfully (${files.length}).`);
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown migration failure.";
  console.error(`Migration failed: ${message}`);
  process.exitCode = 1;
});
