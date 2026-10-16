import ActionForm from "@/components/admin/ActionForm";
import { changePasswordAction } from "../../_actions/auth";

export const metadata = { title: "My password" };

export default function PasswordPage() {
  return (
    <>
      <div className="a-head">
        <div>
          <h1>My password</h1>
          <p>Choose a password that only you know. Changing it signs you out on other phones and computers.</p>
        </div>
      </div>
      <section className="a-card" style={{ maxWidth: 520 }}>
        <ActionForm action={changePasswordAction} submitLabel="Change password" resetOnSuccess>
          <div className="a-field">
            <label htmlFor="current">Current password</label>
            <input id="current" name="current" type="password" required autoComplete="current-password" />
          </div>
          <div className="a-field">
            <label htmlFor="next">New password (at least 8 characters)</label>
            <input id="next" name="next" type="password" required minLength={8} autoComplete="new-password" />
          </div>
          <div className="a-field">
            <label htmlFor="confirm">New password again</label>
            <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" />
          </div>
        </ActionForm>
      </section>
    </>
  );
}
