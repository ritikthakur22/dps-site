import { notFound } from "next/navigation";
import ActionForm from "@/components/admin/ActionForm";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { updateNewsAction } from "../../../_actions/content";
import { NewsFields } from "../fields";

export const metadata = { title: "Edit news" };

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const [n] = await db()<{ id: string; title: string; summary: string; published: Date }[]>`
    select id, title, summary, published from news where id = ${Number(id)}`;
  if (!n) notFound();

  return (
    <>
      <div className="a-head">
        <div>
          <a className="a-crumb" href="/admin/news">
            ← News
          </a>
          <h1>Edit news</h1>
        </div>
      </div>
      <section className="a-card">
        <ActionForm action={updateNewsAction.bind(null, Number(n.id))} submitLabel="Save changes" liveHref={`${SITE_URL}/#news`}>
          <NewsFields title={n.title} summary={n.summary} published={new Date(n.published).toISOString().slice(0, 10)} />
        </ActionForm>
      </section>
    </>
  );
}
