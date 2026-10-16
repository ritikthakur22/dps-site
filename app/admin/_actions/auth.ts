"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  clearSessionCookie,
  hashPassword,
  login,
  logActivity,
  requireOwner,
  requireUser,
  setSessionCookie,
} from "@/lib/auth";
import bcrypt from "bcryptjs";
import { passwordSchema, run, text, usernameSchema, UserError, type Result } from "../_lib/form";

export async function loginAction(fd: FormData): Promise<Result> {
  const username = text(fd, "username");
  const password = typeof fd.get("password") === "string" ? (fd.get("password") as string) : "";
  if (!username || !password) return { ok: false, message: "Enter your username and password." };
  const res = await login(username, password);
  if (!res.ok) return res;
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function changePasswordAction(fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const current = String(fd.get("current") ?? "");
    const next = passwordSchema.parse(String(fd.get("next") ?? ""));
    if (next !== String(fd.get("confirm") ?? "")) throw new UserError("The two new passwords do not match.");
    const sql = db();
    const [row] = await sql<{ password_hash: string }[]>`select password_hash from admin_users where id = ${user.id}`;
    if (!row || !(await bcrypt.compare(current, row.password_hash))) throw new UserError("Your current password is wrong.");
    const [updated] = await sql<{ session_version: number }[]>`
      update admin_users set password_hash = ${await hashPassword(next)}, session_version = session_version + 1
      where id = ${user.id} returning session_version`;
    await setSessionCookie({ ...user, sessionVersion: updated.session_version });
    await logActivity(user, "Changed own password");
    return "Password changed. Other devices have been signed out.";
  });
}

export async function addUserAction(fd: FormData): Promise<Result> {
  const owner = await requireOwner();
  return run(async () => {
    const username = usernameSchema.parse(text(fd, "username"));
    const displayName = text(fd, "displayName");
    if (displayName.length < 2 || displayName.length > 60) throw new UserError("Enter the person's name.");
    const password = passwordSchema.parse(String(fd.get("password") ?? ""));
    const role = fd.get("role") === "owner" ? "owner" : "editor";
    try {
      await db()`insert into admin_users (username, display_name, password_hash, role)
        values (${username}, ${displayName}, ${await hashPassword(password)}, ${role})`;
    } catch (e) {
      if ((e as { code?: string }).code === "23505") throw new UserError("That username is already taken.");
      throw e;
    }
    await logActivity(owner, `Added account ${username}`);
    return `Account "${username}" created. Share the password with them privately.`;
  });
}

export async function resetPasswordAction(userId: number, fd: FormData): Promise<Result> {
  const owner = await requireOwner();
  return run(async () => {
    const password = passwordSchema.parse(String(fd.get("password") ?? ""));
    const [u] = await db()<{ username: string }[]>`
      update admin_users set password_hash = ${await hashPassword(password)}, session_version = session_version + 1
      where id = ${userId} returning username`;
    if (!u) throw new UserError("Account not found.");
    if (userId === owner.id) {
      const [me] = await db()<{ session_version: number }[]>`select session_version from admin_users where id = ${owner.id}`;
      await setSessionCookie({ ...owner, sessionVersion: me.session_version });
    }
    await logActivity(owner, `Reset password for ${u.username}`);
    return `New password set for "${u.username}".`;
  });
}

export async function setUserActiveAction(userId: number, active: boolean): Promise<Result> {
  const owner = await requireOwner();
  return run(async () => {
    if (userId === owner.id) throw new UserError("You cannot turn off your own account.");
    const [u] = await db()<{ username: string }[]>`
      update admin_users set active = ${active}, session_version = session_version + 1
      where id = ${userId} returning username`;
    if (!u) throw new UserError("Account not found.");
    await logActivity(owner, `${active ? "Turned on" : "Turned off"} account ${u.username}`);
    return active ? `"${u.username}" can sign in again.` : `"${u.username}" can no longer sign in.`;
  });
}
