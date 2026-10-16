// Creates or updates the database tables. Usage: npm run db:migrate
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import postgres from "postgres";

for (const envFile of [".env.local", ".env"]) {
  if (existsSync(envFile)) {
    try {
      process.loadEnvFile(envFile);
    } catch {}
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL first (Neon connection string in .env.local or environment).");
  process.exit(1);
}

const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
try {
  const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
  await sql.unsafe(schema);

  // First run: add the six sports from the school banner so the section is not empty.
  const [{ count }] = await sql`select count(*)::int as count from sports`;
  if (count === 0) {
    const names = ["Table tennis", "Basketball", "Football", "Boating", "Billiards", "Volleyball"];
    for (const [i, name] of names.entries()) {
      await sql`insert into sports (name, sort_order) values (${name}, ${i})`;
    }
  }
  console.log("Database is ready.");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
