import { Pool } from "pg";
import { env } from "../config/env";

async function main(): Promise<void> {
  if (!env.databaseUrl) throw new Error("DATABASE_URL is required to check PostgreSQL connectivity.");
  const pool = new Pool({ connectionString: env.databaseUrl, max: 1, connectionTimeoutMillis: 5_000 });
  try {
    const result = await pool.query<{ database: string; now: string }>("select current_database() as database, now()::text as now");
    const row = result.rows[0];
    if (!row) throw new Error("PostgreSQL returned no health row.");
    console.log(`PostgreSQL ready: ${row.database} at ${row.now}`);
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown PostgreSQL connectivity failure.";
  console.error(`PostgreSQL check failed: ${message}`);
  process.exitCode = 1;
});
