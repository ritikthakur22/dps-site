import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { db } from "./db";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./session";

export type AdminUser = {
  id: number;
  username: string;
  displayName: string;
  role: "owner" | "editor";
  sessionVersion: number;
};

type UserRow = {
  id: string;
  username: string;
  display_name: string;
  role: "owner" | "editor";
  session_version: number;
  active: boolean;
  password_hash: string;
};

const toUser = (r: UserRow): AdminUser => ({
  id: Number(r.id),
  username: r.username,
  displayName: r.display_name,
  role: r.role,
  sessionVersion: r.session_version,
});

// Used when the username does not exist, so a wrong username takes as long as a wrong password.
let dummyHash: string | null = null;
const getDummyHash = () => (dummyHash ??= bcrypt.hashSync("not-a-real-password", 10));

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10);

export async function clientIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  return createHash("sha256")
    .update(`${process.env.AUTH_SECRET ?? "dev"}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

const MAX_USER_FAILS = 5;
const MAX_IP_FAILS = 20;

export type LoginResult = { ok: true } | { ok: false; message: string };

export async function login(usernameRaw: string, password: string): Promise<LoginResult> {
  const sql = db();
  const username = usernameRaw.trim().toLowerCase();
  const ipKey = `ip:${await clientIpHash()}`;
  const userKey = `u:${username}`;

  await sql`delete from login_attempts where at < now() - interval '1 day'`;
  const [counts] = await sql<{ u: number; ip: number }[]>`
    select
      count(*) filter (where key = ${userKey})::int as u,
      count(*) filter (where key = ${ipKey})::int as ip
    from login_attempts where at > now() - interval '15 minutes'`;
  if (counts.u >= MAX_USER_FAILS || counts.ip >= MAX_IP_FAILS) {
    return { ok: false, message: "Too many wrong attempts. Please wait 15 minutes and try again." };
  }

  const rows = await sql<UserRow[]>`
    select id, username, display_name, role, session_version, active, password_hash
    from admin_users where lower(username) = ${username}`;
  const row = rows[0];
  const valid = await bcrypt.compare(password, row?.password_hash ?? getDummyHash());

  if (!row || !valid || !row.active) {
    await sql`insert into login_attempts (key) values (${userKey}), (${ipKey})`;
    return { ok: false, message: "Wrong username or password." };
  }

  await sql`delete from login_attempts where key = ${userKey}`;
  await sql`update admin_users set last_login_at = now() where id = ${row.id}`;
  await setSessionCookie(toUser(row));
  return { ok: true };
}

export async function setSessionCookie(user: AdminUser) {
  const token = await signSession({ uid: user.id, sv: user.sessionVersion });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !process.env.INSECURE_COOKIES,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Current user, checked against the database (deactivated users and changed passwords end old sessions). */
export async function currentUser(): Promise<AdminUser | null> {
  const claims = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!claims) return null;
  const rows = await db()<UserRow[]>`
    select id, username, display_name, role, session_version, active, password_hash
    from admin_users where id = ${claims.uid}`;
  const row = rows[0];
  if (!row || !row.active || row.session_version !== claims.sv) return null;
  return toUser(row);
}

export async function requireUser(): Promise<AdminUser> {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireOwner(): Promise<AdminUser> {
  const user = await requireUser();
  if (user.role !== "owner") redirect("/admin");
  return user;
}

export async function logActivity(user: AdminUser, action: string) {
  await db()`insert into activity_log (user_id, who, action) values (${user.id}, ${user.displayName}, ${action.slice(0, 200)})`;
}
