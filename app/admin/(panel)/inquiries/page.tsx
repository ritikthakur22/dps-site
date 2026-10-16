import ActionButton from "@/components/admin/ActionButton";
import StatusSelect from "@/components/admin/StatusSelect";
import Where from "@/components/admin/Where";
import { db } from "@/lib/db";
import { deleteInquiryAction, setInquiryStatusAction } from "../../_actions/content";

export const metadata = { title: "Inquiries" };

export default async function InquiriesPage() {
  const rows = await db()<
    { id: string; parent_name: string; phone: string; grade: string; message: string; status: string; created_at: Date }[]
  >`select id, parent_name, phone, grade, message, status, created_at from inquiries
    order by (status = 'new') desc, created_at desc limit 200`;

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Admission inquiries</h1>
          <p>Parents who filled the form on the website. Call them, then change the status so everyone knows.</p>
        </div>
      </div>
      <Where place="These come from the Admissions form on the home page" href="/#admissions" />

      <section className="a-card">
        {rows.length === 0 ? (
          <p className="a-empty" style={{ marginTop: 0 }}>
            No inquiries yet.
          </p>
        ) : (
          <div className="a-list" style={{ marginTop: 0 }}>
            {rows.map((r) => {
              const id = Number(r.id);
              return (
                <div key={r.id} className="a-item">
                  <div className="a-item-body">
                    <b>
                      {r.parent_name} {r.status === "new" && <span className="a-pill new">New</span>}
                    </b>
                    <small>
                      Phone: <b style={{ display: "inline", userSelect: "all" }}>{r.phone}</b> · For: {r.grade} ·{" "}
                      {new Date(r.created_at).toLocaleString("en-GB", {
                        timeZone: "Asia/Kathmandu",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </small>
                    {r.message && <small style={{ marginTop: 4, color: "var(--a-text)" }}>“{r.message}”</small>}
                  </div>
                  <div className="a-actions">
                    <a className="a-btn small" href={`tel:${r.phone.replace(/[^0-9+]/g, "")}`}>
                      Call
                    </a>
                    <StatusSelect id={`status-${id}`} value={r.status} action={setInquiryStatusAction.bind(null, id)} />
                    <ActionButton action={deleteInquiryAction.bind(null, id)} label="Delete" variant="danger" confirm="Delete?" />
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
