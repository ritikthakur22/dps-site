import ActionButton from "@/components/admin/ActionButton";
import GalleryUploader from "@/components/admin/GalleryUploader";
import Where from "@/components/admin/Where";
import { db } from "@/lib/db";
import { imageUrl } from "@/lib/images";
import { GALLERY_CATEGORIES, SITE_URL } from "@/lib/site";
import { addGalleryPhotoAction, deleteGalleryPhotoAction } from "../../_actions/content";

export const metadata = { title: "Gallery" };

export default async function GalleryAdminPage() {
  const photos = await db()<{ id: string; caption: string | null; category: string; photo_url: string }[]>`
    select id, caption, category, photo_url from gallery_photos order by created_at desc, id desc`;

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Gallery</h1>
          <p>The newest 8 photos appear on the home page. All photos appear on the Gallery page.</p>
        </div>
      </div>
      <Where place="Home page, Gallery, and the Gallery page" href="/gallery" />

      <section className="a-card">
        <h2>Upload photos</h2>
        <GalleryUploader action={addGalleryPhotoAction} categories={GALLERY_CATEGORIES} liveHref={`${SITE_URL}/gallery`} />
      </section>

      <section className="a-card">
        <h2>All photos ({photos.length})</h2>
        {photos.length === 0 ? (
          <p className="a-empty">No photos yet.</p>
        ) : (
          <div className="a-photos">
            {photos.map((p, i) => (
              <div key={p.id} className="a-photo-card">
                <img src={imageUrl(p.photo_url, "card") ?? ""} alt={p.caption ?? ""} width={320} height={240} loading="lazy" />
                <div>
                  <small>
                    <span className="a-pill">{p.category}</span> {i < 8 && "· On home page"}
                    {p.caption ? <><br />{p.caption}</> : null}
                  </small>
                  <div className="a-actions">
                    <a className="a-btn small ghost" href={`/admin/gallery/${p.id}`}>
                      Edit
                    </a>
                    <ActionButton action={deleteGalleryPhotoAction.bind(null, Number(p.id))} label="Delete" variant="danger" confirm="Delete?" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
