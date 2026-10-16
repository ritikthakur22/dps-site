import AdminNav from "@/components/admin/AdminNav";
import Logo from "@/components/site/Logo";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { logoutAction } from "../_actions/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [{ n }] = await db()<{ n: number }[]>`select count(*)::int as n from inquiries where status = 'new'`;

  const items = [
    { href: "/admin", label: "Home" },
    { href: "/admin/settings", label: "Website text" },
    { href: "/admin/batches", label: "Class 10 batches" },
    { href: "/admin/featured", label: "Featured students" },
    { href: "/admin/sports", label: "Sports" },
    { href: "/admin/gallery", label: "Gallery" },
    { href: "/admin/news", label: "News" },
    { href: "/admin/inquiries", label: "Inquiries", badge: n },
    ...(user.role === "owner" ? [{ href: "/admin/accounts", label: "Accounts" }] : []),
    { href: "/admin/password", label: "My password" },
  ];

  return (
    <div className="a-shell">
      <aside className="a-side">
        <a href="/admin" className="a-brand">
          <Logo size={36} />
          <span>
            <b>Daffodils</b>
            <small>Website admin</small>
          </span>
        </a>
        <AdminNav items={items} />
        <div className="a-side-foot">
          <span>Signed in as {user.displayName}</span>
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#ffd60a", fontWeight: 700 }}>
            Open website ↗
          </a>
          <form action={logoutAction}>
            <button type="submit" className="a-btn small ghost">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="a-main">
        <div className="a-content">{children}</div>
      </main>
    </div>
  );
}
