import { notFound } from "next/navigation";
import ActionForm from "@/components/admin/ActionForm";
import PhotoInput from "@/components/admin/PhotoInput";
import { db } from "@/lib/db";
import { imageUrl } from "@/lib/images";
import { SITE_URL } from "@/lib/site";
import { updateStudentAction } from "../../../../_actions/content";
import { StudentFields } from "../fields";

export const metadata = { title: "Edit student" };

export default async function EditStudentPage({ params }: { params: Promise<{ year: string; id: string }> }) {
  const { year, id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const [s] = await db()<{ id: string; year: number; name: string; gpa: number; now_doing: string | null; photo_url: string | null }[]>`
    select id, year, name, gpa, now_doing, photo_url from batch_students where id = ${Number(id)}`;
  if (!s || String(s.year) !== year) notFound();

  return (
    <>
      <div className="a-head">
        <div>
          <a className="a-crumb" href={`/admin/batches/${s.year}`}>
            ← Batch {s.year}
          </a>
          <h1>Edit {s.name}</h1>
        </div>
      </div>
      <section className="a-card">
        <ActionForm action={updateStudentAction.bind(null, Number(s.id))} submitLabel="Save changes" liveHref={`${SITE_URL}/batches/${s.year}`}>
          <StudentFields name={s.name} gpa={Number(s.gpa).toFixed(2)} nowDoing={s.now_doing ?? ""} />
          <PhotoInput maxSide={900} label="Photo" current={imageUrl(s.photo_url, "thumb")} allowRemove hint="Choose a new photo to replace the current one." />
        </ActionForm>
      </section>
    </>
  );
}
