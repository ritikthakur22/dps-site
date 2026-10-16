import { notFound } from "next/navigation";
import ActionForm from "@/components/admin/ActionForm";
import PhotoInput from "@/components/admin/PhotoInput";
import { db } from "@/lib/db";
import { imageUrl } from "@/lib/images";
import { SITE_URL } from "@/lib/site";
import { updateSportAction } from "../../../_actions/content";

export const metadata = { title: "Edit sport" };

export default async function EditSportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const [s] = await db()<{ id: string; name: string; photo_url: string | null }[]>`
    select id, name, photo_url from sports where id = ${Number(id)}`;
  if (!s) notFound();

  return (
    <>
      <div className="a-head">
        <div>
          <a className="a-crumb" href="/admin/sports">
            ← Sports
          </a>
          <h1>Edit {s.name}</h1>
        </div>
      </div>
      <section className="a-card">
        <ActionForm action={updateSportAction.bind(null, Number(s.id))} submitLabel="Save changes" liveHref={`${SITE_URL}/#sports`}>
          <div className="a-field" style={{ maxWidth: 420 }}>
            <label htmlFor="name">Sport name</label>
            <input id="name" name="name" type="text" defaultValue={s.name} required minLength={2} maxLength={40} />
          </div>
          <PhotoInput maxSide={1200} label="Photo" current={imageUrl(s.photo_url, "thumb")} allowRemove />
        </ActionForm>
      </section>
    </>
  );
}
