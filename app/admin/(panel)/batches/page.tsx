import ActionForm from "@/components/admin/ActionForm";
import ActionButton from "@/components/admin/ActionButton";
import Where from "@/components/admin/Where";
import { db } from "@/lib/db";
import { addBatchAction, deleteBatchAction, setBatchVisibleAction } from "../../_actions/content";

export const metadata = { title: "Class 10 batches" };

export default async function BatchesPage() {
  const batches = await db()<{ year: number; visible: boolean; students: number; photos: number }[]>`
    select b.year, b.visible,
      count(s.id)::int as students,
      count(s.photo_url)::int as photos
    from batches b left join batch_students s on s.year = b.year
    group by b.year order by b.year desc`;
  const suggested = batches.length ? batches[0].year + 1 : 2080;

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Class 10 batches</h1>
          <p>One batch per SEE year. The home page shows the top 15 by GPA, and a full page lists everyone.</p>
        </div>
      </div>
      <Where place="Home page, Class 10 batches (and the “View all students” page)" href="/#batches" />

      <section className="a-card">
        <h2>Add a new batch</h2>
        <p>Add the year first, then open it to add the students.</p>
        <ActionForm action={addBatchAction} submitLabel="Add batch" resetOnSuccess>
          <div className="a-field" style={{ maxWidth: 260 }}>
            <label htmlFor="year">Batch year (B.S.)</label>
            <input id="year" name="year" type="number" inputMode="numeric" min={2060} max={2150} defaultValue={suggested} required />
          </div>
        </ActionForm>
      </section>

      <section className="a-card">
        <h2>All batches</h2>
        {batches.length === 0 ? (
          <p className="a-empty">No batches yet. Add the 2080 batch above to start.</p>
        ) : (
          <div className="a-list">
            {batches.map((b) => (
              <div key={b.year} className={b.visible ? "a-item" : "a-item muted"}>
                <div className="a-thumb" aria-hidden="true">
                  {b.year}
                </div>
                <div className="a-item-body">
                  <b>Batch {b.year}</b>
                  <small>
                    {b.students} student{b.students === 1 ? "" : "s"} · {b.photos} with photo ·{" "}
                    {b.visible ? (b.students ? "Shown on website" : "Shown once students are added") : "Hidden from website"}
                  </small>
                </div>
                <div className="a-actions">
                  <a className="a-btn small" href={`/admin/batches/${b.year}`}>
                    Open and add students
                  </a>
                  <ActionButton
                    action={setBatchVisibleAction.bind(null, b.year, !b.visible)}
                    label={b.visible ? "Hide" : "Show"}
                  />
                  <ActionButton
                    action={deleteBatchAction.bind(null, b.year)}
                    label="Delete"
                    variant="danger"
                    confirm={`Delete batch ${b.year} and all ${b.students} students?`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
