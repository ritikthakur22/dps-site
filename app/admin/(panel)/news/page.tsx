import ActionForm from "@/components/admin/ActionForm";
import ActionButton from "@/components/admin/ActionButton";
import Where from "@/components/admin/Where";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { addNewsAction, deleteNewsAction, setNewsVisibleAction } from "../../_actions/content";
import { NewsFields } from "./fields";

export const metadata = { title: "News" };

const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kathmandu" });

export default async function NewsAdminPage() {
  const items = await db()<{ id: string; title: string; summary: string; published: Date; visible: boolean }[]>`
    select id, title, summary, published, visible from news order by published desc, id desc`;

  return (
    <>
      <div className="a-head">
        <div>
          <h1>News and notices</h1>
          <p>The newest 6 shown items appear on the home page. The section is hidden when there is no news.</p>
        </div>
      </div>
      <Where place="Home page, News and notices" href="/#news" />

      <section className="a-card">
        <h2>Post news</h2>
        <ActionForm action={addNewsAction} submitLabel="Post news" resetOnSuccess liveHref={`${SITE_URL}/#news`}>
          <NewsFields published={today()} />
        </ActionForm>
      </section>

      <section className="a-card">
        <h2>All news</h2>
        {items.length === 0 ? (
          <p className="a-empty">No news yet.</p>
        ) : (
          <div className="a-list">
            {items.map((n) => {
              const id = Number(n.id);
              const date = new Date(n.published).toISOString().slice(0, 10);
              return (
                <div key={n.id} className={n.visible ? "a-item" : "a-item muted"}>
                  <div className="a-item-body">
                    <b>
                      {n.title} {!n.visible && <span className="a-pill off">Hidden</span>}
                    </b>
                    <small>
                      {date} · {n.summary}
                    </small>
                  </div>
                  <div className="a-actions">
                    <a className="a-btn small ghost" href={`/admin/news/${id}`}>
                      Edit
                    </a>
                    <ActionButton action={setNewsVisibleAction.bind(null, id, !n.visible)} label={n.visible ? "Hide" : "Show"} />
                    <ActionButton action={deleteNewsAction.bind(null, id)} label="Delete" variant="danger" confirm="Delete this news?" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
