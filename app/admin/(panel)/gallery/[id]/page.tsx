import { notFound } from "next/navigation";
import ActionForm from "@/components/admin/ActionForm";
import { db } from "@/lib/db";
import { imageUrl } from "@/lib/images";
import { GALLERY_CATEGORIES, SITE_URL } from "@/lib/site";
import { updateGalleryPhotoAction } from "../../../_actions/content";

export const metadata = { title: "Edit photo" };

export default async function EditPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const [p] = await db()<{ id: string; caption: string | null; category: string; photo_url: string }[]>`
    select id, caption, category, photo_url from gallery_photos where id = ${Number(id)}`;
  if (!p) notFound();

  return (
    <>
      <div className="a-head">
        <div>
          <a className="a-crumb" href="/admin/gallery">
            ← Gallery
          </a>
          <h1>Edit photo</h1>
        </div>
      </div>
      <section className="a-card">
        <img
          src={imageUrl(p.photo_url, "card") ?? ""}
          alt=""
          width={640}
          height={480}
          style={{ width: "100%", maxWidth: 480, height: "auto", borderRadius: 14 }}
        />
        <ActionForm action={updateGalleryPhotoAction.bind(null, Number(p.id))} submitLabel="Save changes" liveHref={`${SITE_URL}/gallery`}>
          <div className="a-row">
            <div className="a-field">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" defaultValue={p.category}>
                {GALLERY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="a-field">
              <label htmlFor="caption">Caption (optional)</label>
              <input id="caption" name="caption" type="text" defaultValue={p.caption ?? ""} maxLength={120} />
            </div>
          </div>
        </ActionForm>
      </section>
    </>
  );
}
