import { createHash } from "node:crypto";
const key = process.env.POWERCHAIN_API_KEY ?? process.argv[2];
if (!key || key.length < 16) { console.error("Set POWERCHAIN_API_KEY or pass an API key of at least 16 characters."); process.exit(1); }
console.log(createHash("sha256").update(key,"utf8").digest("hex"));
