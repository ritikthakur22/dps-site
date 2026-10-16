import ActionForm from "@/components/admin/ActionForm";
import ActionButton from "@/components/admin/ActionButton";
import PhotoInput from "@/components/admin/PhotoInput";
import Where from "@/components/admin/Where";
import { db } from "@/lib/db";
import { imageUrl, initials } from "@/lib/images";
import { SITE_URL } from "@/lib/site";
import { addSportAction, deleteSportAction, moveSportAction } from "../../_actions/content";

export const metadata = { title: "Sports" };

export default async function SportsPage() {
  const sports = await db()<{ id: string; name: string; photo_url: string | null }[]>`
    select id, name, photo_url from sports order by sort_order, id`;

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Sports</h1>
          <p>Each sport is shown with one photo. The sports centre address is changed under Website text.</p>
        </div>
      </div>
      <Where place="Home page, Facilities → Sports centre" href="/#sports" />

      <section className="a-card">
        <h2>Add a sport</h2>
        <ActionForm action={addSportAction} submitLabel="Add sport" resetOnSuccess liveHref={`${SITE_URL}/#sports`}>
          <div className="a-field" style={{ maxWidth: 420 }}>
            <label htmlFor="name">Sport name</label>
            <input id="name" name="name" type="text" required minLength={2} maxLength={40} placeholder="e.g. Cricket" />
          </div>
          <PhotoInput maxSide={1200} label="Photo (optional)" />
        </ActionForm>
      </section>

      <section className="a-card">
        <h2>Sports on the website</h2>
        {sports.length === 0 ? (
          <p className="a-empty">No sports yet.</p>
        ) : (
          <div className="a-list">
            {sports.map((s, i) => {
              const id = Number(s.id);
              const thumb = imageUrl(s.photo_url, "thumb");
              return (
                <div key={s.id} className="a-item">
                  {thumb ? (
                    <img className="a-thumb" src={thumb} alt="" width={64} height={64} />
                  ) : (
                    <span className="a-thumb" aria-hidden="true">
                      {initials(s.name)}
                    </span>
                  )}
                  <div className="a-item-body">
                    <b>{s.name}</b>
                    <small>{s.photo_url ? "Has a photo" : "No photo yet. Click Edit to add one."}</small>
                  </div>
                  <div className="a-actions">
                    {i > 0 && <ActionButton action={moveSportAction.bind(null, id, "up")} label="Up" />}
                    {i < sports.length - 1 && <ActionButton action={moveSportAction.bind(null, id, "down")} label="Down" />}
                    <a className="a-btn small ghost" href={`/admin/sports/${id}`}>
                      Edit
                    </a>
                    <ActionButton action={deleteSportAction.bind(null, id)} label="Delete" variant="danger" confirm={`Delete ${s.name}?`} />
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
