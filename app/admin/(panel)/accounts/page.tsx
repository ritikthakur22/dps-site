import ActionForm from "@/components/admin/ActionForm";
import ActionButton from "@/components/admin/ActionButton";
import { db } from "@/lib/db";
import { requireOwner } from "@/lib/auth";
import { addUserAction, resetPasswordAction, setUserActiveAction } from "../../_actions/auth";

export const metadata = { title: "Accounts" };

export default async function AccountsPage() {
  const me = await requireOwner();
  const users = await db()<
    { id: string; username: string; display_name: string; role: string; active: boolean; last_login_at: Date | null }[]
  >`select id, username, display_name, role, active, last_login_at from admin_users order by active desc, display_name`;

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Accounts</h1>
          <p>
            Who can sign in to this admin panel. <b>Editors</b> can change website content and see inquiries.{" "}
            <b>Owners</b> can also manage accounts.
          </p>
        </div>
      </div>

      <section className="a-card">
        <h2>Add a person</h2>
        <ActionForm action={addUserAction} submitLabel="Create account" resetOnSuccess>
          <div className="a-row">
            <div className="a-field">
              <label htmlFor="displayName">Their name</label>
              <input id="displayName" name="displayName" type="text" required minLength={2} maxLength={60} placeholder="e.g. Office Sita" />
            </div>
            <div className="a-field">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" type="text" required pattern="[A-Za-z0-9._\-]{3,32}" autoCapitalize="none" autoComplete="off" />
            </div>
          </div>
          <div className="a-row">
            <div className="a-field">
              <label htmlFor="password">Password (at least 8 characters)</label>
              <input id="password" name="password" type="text" required minLength={8} autoComplete="new-password" />
              <span className="a-hint">Give it to them privately. They can change it under My password.</span>
            </div>
            <div className="a-field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" defaultValue="editor">
                <option value="editor">Editor (content only)</option>
                <option value="owner">Owner (content and accounts)</option>
              </select>
            </div>
          </div>
        </ActionForm>
      </section>

      <section className="a-card">
        <h2>People</h2>
        <div className="a-list">
          {users.map((u) => {
            const id = Number(u.id);
            return (
              <div key={u.id} className={u.active ? "a-item" : "a-item muted"}>
                <div className="a-item-body">
                  <b>
                    {u.display_name} <span className={u.active ? "a-pill" : "a-pill off"}>{u.active ? u.role : "Turned off"}</span>
                  </b>
                  <small>
                    Username: {u.username} · Last sign-in:{" "}
                    {u.last_login_at
                      ? new Date(u.last_login_at).toLocaleString("en-GB", { timeZone: "Asia/Kathmandu", dateStyle: "medium", timeStyle: "short" })
                      : "never"}
                  </small>
                </div>
                <details>
                  <summary className="a-btn small ghost" style={{ listStyle: "none" }}>
                    Set new password
                  </summary>
                  <ActionForm action={resetPasswordAction.bind(null, id)} submitLabel="Save password" resetOnSuccess>
                    <div className="a-field">
                      <label htmlFor={`pw-${id}`}>New password</label>
                      <input id={`pw-${id}`} name="password" type="text" required minLength={8} autoComplete="new-password" />
                    </div>
                  </ActionForm>
                </details>
                {id !== me.id && (
                  <ActionButton
                    action={setUserActiveAction.bind(null, id, !u.active)}
                    label={u.active ? "Turn off" : "Turn on"}
                    variant={u.active ? "danger" : "ghost"}
                    confirm={u.active ? `${u.display_name} will not be able to sign in. Continue?` : undefined}
                    confirmLabel="Yes, turn off"
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
