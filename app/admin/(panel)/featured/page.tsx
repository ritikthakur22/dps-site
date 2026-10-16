import ActionForm from "@/components/admin/ActionForm";
import ActionButton from "@/components/admin/ActionButton";
import PhotoInput from "@/components/admin/PhotoInput";
import Where from "@/components/admin/Where";
import { db } from "@/lib/db";
import { imageUrl, initials } from "@/lib/images";
import { MAX_HIGHLIGHTS, SITE_URL } from "@/lib/site";
import {
  addHighlightAction,
  deleteHighlightAction,
  moveHighlightAction,
  setHighlightActiveAction,
} from "../../_actions/content";
import { HighlightFields } from "./fields";

export const metadata = { title: "Featured students" };

export default async function FeaturedPage() {
  const items = await db()<
    { id: string; name: string; grade: string; achievement: string; category: string; photo_url: string | null; active: boolean }[]
  >`select id, name, grade, achievement, category, photo_url, active from highlights order by sort_order, id`;
  const shown = items.filter((i) => i.active).length;
  const full = shown >= MAX_HIGHLIGHTS;

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Featured students</h1>
          <p>
            Students with special achievements (sports, arts, olympiads, alumni). Up to {MAX_HIGHLIGHTS} are shown. Now
            showing <b>{shown} of {MAX_HIGHLIGHTS}</b>.
          </p>
        </div>
      </div>
      <Where place="Home page, Our students" href="/#showcase" />

      <section className="a-card">
        <h2>Add a featured student</h2>
        {full ? (
          <p className="a-msg err" style={{ marginTop: 12 }}>
            All {MAX_HIGHLIGHTS} places are used. Hide or delete one below before adding another.
          </p>
        ) : (
          <ActionForm action={addHighlightAction} submitLabel="Add student" resetOnSuccess liveHref={`${SITE_URL}/#showcase`}>
            <HighlightFields />
            <PhotoInput maxSide={1200} label="Photo (optional)" />
          </ActionForm>
        )}
      </section>

      <section className="a-card">
        <h2>Order on the website</h2>
        <p>Use Up and Down to change the order. Hidden students stay saved but are not shown.</p>
        {items.length === 0 ? (
          <p className="a-empty">No featured students yet.</p>
        ) : (
          <div className="a-list">
            {items.map((h, i) => {
              const id = Number(h.id);
              const thumb = imageUrl(h.photo_url, "thumb");
              return (
                <div key={h.id} className={h.active ? "a-item" : "a-item muted"}>
                  {thumb ? (
                    <img className="a-thumb" src={thumb} alt="" width={64} height={64} />
                  ) : (
                    <span className="a-thumb" aria-hidden="true">
                      {initials(h.name)}
                    </span>
                  )}
                  <div className="a-item-body">
                    <b>
                      {h.name} <span className={h.active ? "a-pill" : "a-pill off"}>{h.active ? h.category : "Hidden"}</span>
                    </b>
                    <small>
                      {h.grade} · {h.achievement}
                    </small>
                  </div>
                  <div className="a-actions">
                    {i > 0 && <ActionButton action={moveHighlightAction.bind(null, id, "up")} label="Up" />}
                    {i < items.length - 1 && <ActionButton action={moveHighlightAction.bind(null, id, "down")} label="Down" />}
                    <a className="a-btn small ghost" href={`/admin/featured/${id}`}>
                      Edit
                    </a>
                    {(h.active || !full) && (
                      <ActionButton action={setHighlightActiveAction.bind(null, id, !h.active)} label={h.active ? "Hide" : "Show"} />
                    )}
                    <ActionButton action={deleteHighlightAction.bind(null, id)} label="Delete" variant="danger" confirm={`Delete ${h.name}?`} />
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
