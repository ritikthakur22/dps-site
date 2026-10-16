import { redirect } from "next/navigation";
import ActionForm from "@/components/admin/ActionForm";
import Logo from "@/components/site/Logo";
import { currentUser } from "@/lib/auth";
import { loginAction } from "../_actions/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/admin");
  return (
    <main className="a-login">
      <div className="a-card">
        <Logo size={48} />
        <h1>Daffodils website admin</h1>
        <p style={{ color: "var(--a-muted)", marginTop: 6 }}>Sign in to update the school website.</p>
        <ActionForm action={loginAction} submitLabel="Sign in" pendingLabel="Signing in...">
          <div className="a-field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" autoComplete="username" autoCapitalize="none" required />
          </div>
          <div className="a-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
        </ActionForm>
        <p className="a-hint" style={{ marginTop: 16 }}>
          Forgot your password? Ask the website owner to set a new one for you.
        </p>
      </div>
    </main>
  );
}
