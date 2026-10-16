import { notFound } from "next/navigation";
import ActionForm from "@/components/admin/ActionForm";
import PhotoInput from "@/components/admin/PhotoInput";
import { db } from "@/lib/db";
import { imageUrl } from "@/lib/images";
import { SITE_URL } from "@/lib/site";
import { updateHighlightAction } from "../../../_actions/content";
import { HighlightFields } from "../fields";

export const metadata = { title: "Edit featured student" };

export default async function EditFeaturedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const [h] = await db()<
    { id: string; name: string; grade: string; achievement: string; category: string; photo_url: string | null }[]
  >`select id, name, grade, achievement, category, photo_url from highlights where id = ${Number(id)}`;
  if (!h) notFound();

  return (
    <>
      <div className="a-head">
        <div>
          <a className="a-crumb" href="/admin/featured">
            ← Featured students
          </a>
          <h1>Edit {h.name}</h1>
        </div>
      </div>
      <section className="a-card">
        <ActionForm action={updateHighlightAction.bind(null, Number(h.id))} submitLabel="Save changes" liveHref={`${SITE_URL}/#showcase`}>
          <HighlightFields name={h.name} grade={h.grade} achievement={h.achievement} category={h.category} />
          <PhotoInput maxSide={1200} label="Photo" current={imageUrl(h.photo_url, "thumb")} allowRemove />
        </ActionForm>
      </section>
    </>
  );
}
