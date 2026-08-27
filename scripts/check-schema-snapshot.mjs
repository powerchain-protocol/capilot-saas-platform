import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrations = path.join(root, "apps/backend/src/storage/migrations");
const snapshot = await readFile(path.join(root, "api/schema.sql"), "utf8");
const required = ["0002_credits.sql", "0003_credit_quotes_receipts.sql"];

for (const name of required) {
  const sql = (await readFile(path.join(migrations, name), "utf8")).trim();
  if (!snapshot.includes(sql)) throw new Error(`api/schema.sql is stale: missing exact ${name} contents.`);
}
console.log(`Schema snapshot audit passed (${required.length} credit migrations mirrored).`);
