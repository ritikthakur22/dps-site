// Creates the first admin (owner) account, or resets its password.
// Usage: npm run admin:create -- <username> "<Display Name>"
// The password is asked for in the terminal (or read from ADMIN_PASSWORD).
import readline from "node:readline/promises";
import { existsSync } from "node:fs";
import bcrypt from "bcryptjs";
import postgres from "postgres";

for (const envFile of [".env.local", ".env"]) {
  if (existsSync(envFile)) {
    try {
      process.loadEnvFile(envFile);
    } catch {}
  }
}

const [username, displayName] = process.argv.slice(2);
if (!process.env.DATABASE_URL || !username) {
  console.error('Usage: npm run admin:create -- <username> "<Display Name>" (ensure DATABASE_URL is in .env.local)');
  process.exit(1);
}
if (!/^[a-z0-9._-]{3,32}$/i.test(username)) {
  console.error("Username: 3-32 letters, numbers, dot, dash or underscore.");
  process.exit(1);
}

let password = process.env.ADMIN_PASSWORD;
if (!password) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  password = await rl.question("Password (at least 8 characters): ");
  rl.close();
}
if (!password || password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
try {
  const hash = await bcrypt.hash(password, 10);
  const name = displayName || username;
  const existing = await sql`select id from admin_users where lower(username) = ${username.toLowerCase()}`;
  if (existing.length) {
    await sql`update admin_users set password_hash = ${hash}, role = 'owner', active = true,
      session_version = session_version + 1 where id = ${existing[0].id}`;
    console.log(`Updated owner account "${username}".`);
  } else {
    await sql`insert into admin_users (username, display_name, password_hash, role)
      values (${username.toLowerCase()}, ${name}, ${hash}, 'owner')`;
    console.log(`Created owner account "${username}".`);
  }
} catch (err) {
  console.error("Failed:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
