import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrations = path.join(root, "supabase/migrations");
const snapshot = await readFile(path.join(root, "api/schema.sql"), "utf8");
const required = ["20260827000200_credits.sql", "20260827000300_credit_quotes_receipts.sql"];

for (const name of required) {
  const sql = (await readFile(path.join(migrations, name), "utf8")).trim();
  if (!snapshot.includes(sql)) throw new Error(`api/schema.sql is stale: missing exact ${name} contents.`);
}
console.log(`Schema snapshot audit passed (${required.length} Supabase/PostgreSQL migrations mirrored).`);
