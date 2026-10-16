import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import BatchList from "@/components/site/BatchList";
import { getBatch, getSettings, getVisibleBatchYears } from "@/lib/content";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return []; // built on first visit, then cached
}

type Props = { params: Promise<{ year: string }> };

function parseYear(raw: string): number | null {
  return /^\d{4}$/.test(raw) ? Number(raw) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const year = parseYear((await params).year);
  return {
    title: year ? `Class 10 batch ${year} B.S.` : "Class 10 batch",
    description: year ? `SEE results of the Daffodils Public School Class 10 batch of ${year} B.S.` : undefined,
    alternates: year ? { canonical: `/batches/${year}` } : undefined,
  };
}

export default async function BatchPage({ params }: Props) {
  const year = parseYear((await params).year);
  if (!year) notFound();
  const [settings, students, years] = await Promise.all([getSettings(), getBatch(year), getVisibleBatchYears()]);
  if (!students || students.length === 0) notFound();

  return (
    <>
      <Header phone1={settings.phone1} phone2={settings.phone2} email={settings.email} address={settings.address} />
      <main>
        <section className="page-head">
          <div className="wrap">
            <a href="/#batches" className="back">
              ← Back to home
            </a>
            <h1>Class 10 batch {year} B.S.</h1>
            <p>All {students.length} students, ranked by SEE GPA.</p>
            {years.length > 1 && (
              <nav className="year-links" aria-label="Other batches">
                {years.map((y) => (
                  <a key={y} href={`/batches/${y}`} aria-current={y === year ? "page" : undefined}>
                    {y}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </section>
        <section className="section soft">
          <div className="wrap">
            <BatchList students={students} />
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
