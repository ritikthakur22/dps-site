import { notFound } from "next/navigation";
import ActionForm from "@/components/admin/ActionForm";
import ActionButton from "@/components/admin/ActionButton";
import PhotoInput from "@/components/admin/PhotoInput";
import Where from "@/components/admin/Where";
import { db } from "@/lib/db";
import { rankStudents } from "@/lib/content";
import { imageUrl, initials } from "@/lib/images";
import { BATCH_TOP_COUNT, SITE_URL } from "@/lib/site";
import { addStudentAction, deleteStudentAction, setBatchVisibleAction } from "../../../_actions/content";
import { StudentFields } from "./fields";

type Props = { params: Promise<{ year: string }> };

export async function generateMetadata({ params }: Props) {
  return { title: `Batch ${(await params).year}` };
}

export default async function BatchAdminPage({ params }: Props) {
  const raw = (await params).year;
  if (!/^\d{4}$/.test(raw)) notFound();
  const year = Number(raw);
  const sql = db();
  const [batch] = await sql<{ visible: boolean }[]>`select visible from batches where year = ${year}`;
  if (!batch) notFound();
  const rows = await sql<{ id: string; name: string; gpa: number; now_doing: string | null; photo_url: string | null }[]>`
    select id, name, gpa, now_doing, photo_url from batch_students where year = ${year} order by gpa desc, name asc`;
  const students = rankStudents(
    rows.map((r) => ({ id: Number(r.id), year, name: r.name, gpa: Number(r.gpa), nowDoing: r.now_doing, photoUrl: r.photo_url })),
  );

  return (
    <>
      <div className="a-head">
        <div>
          <a className="a-crumb" href="/admin/batches">
            ← All batches
          </a>
          <h1>Batch {year}</h1>
          <p>
            {students.length} student{students.length === 1 ? "" : "s"}.{" "}
            {batch.visible ? "Shown on the website." : "Hidden from the website."}
          </p>
        </div>
        <ActionButton action={setBatchVisibleAction.bind(null, year, !batch.visible)} label={batch.visible ? "Hide this batch" : "Show this batch"} />
      </div>
      <Where place={`Home page, Class 10 batches → Batch ${year}, and the page /batches/${year}`} href={`/batches/${year}`} />

      <section className="a-card">
        <h2>Add a student</h2>
        <p>After saving, the form clears so you can type the next student straight away.</p>
        <ActionForm
          action={addStudentAction.bind(null, year)}
          submitLabel="Add student"
          resetOnSuccess
          focusAfterReset="name"
          liveHref={`${SITE_URL}/batches/${year}`}
        >
          <StudentFields />
          <PhotoInput maxSide={900} label="Photo (optional)" hint="A clear face photo. Shrunk automatically." />
        </ActionForm>
      </section>

      <section className="a-card">
        <h2>Students, ranked by GPA</h2>
        <p>The top {BATCH_TOP_COUNT} appear on the home page. Everyone appears on the batch page.</p>
        {students.length === 0 ? (
          <p className="a-empty">No students yet. Add the first one above.</p>
        ) : (
          <div className="a-list">
            {students.map((s, i) => {
              const thumb = imageUrl(s.photoUrl, "thumb");
              return (
                <div key={s.id} className="a-item">
                  <span className="a-rank">#{s.rank}</span>
                  {thumb ? (
                    <img className="a-thumb" src={thumb} alt="" width={64} height={64} />
                  ) : (
                    <span className="a-thumb" aria-hidden="true">
                      {initials(s.name)}
                    </span>
                  )}
                  <div className="a-item-body">
                    <b>{s.name}</b>
                    <small>
                      GPA {s.gpa.toFixed(2)}
                      {s.nowDoing ? ` · Now: ${s.nowDoing}` : ""}
                      {i < BATCH_TOP_COUNT ? " · On home page" : ""}
                      {!s.photoUrl ? " · No photo" : ""}
                    </small>
                  </div>
                  <div className="a-actions">
                    <a className="a-btn small ghost" href={`/admin/batches/${year}/${s.id}`}>
                      Edit
                    </a>
                    <ActionButton
                      action={deleteStudentAction.bind(null, s.id)}
                      label="Delete"
                      variant="danger"
                      confirm={`Delete ${s.name}?`}
                    />
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
