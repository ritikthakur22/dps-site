import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";

export const metadata = { title: "Home" };

type Counts = {
  batches: number;
  students: number;
  featured: number;
  sports: number;
  photos: number;
  news: number;
  newInquiries: number;
};

export default async function Dashboard() {
  const user = await requireUser();
  const sql = db();
  const [c] = await sql<Counts[]>`
    select
      (select count(*) from batches)::int as batches,
      (select count(*) from batch_students)::int as students,
      (select count(*) from highlights where active)::int as featured,
      (select count(*) from sports)::int as sports,
      (select count(*) from gallery_photos)::int as photos,
      (select count(*) from news where visible)::int as news,
      (select count(*) from inquiries where status = 'new')::int as "newInquiries"`;
  const feed = await sql<{ who: string; action: string; at: Date }[]>`
    select who, action, at from activity_log order by at desc limit 12`;

  const cards = [
    { href: "/admin/inquiries", n: c.newInquiries, label: "New inquiries", hint: "Parents waiting for a call" },
    { href: "/admin/batches", n: c.students, label: "Class 10 students", hint: `${c.batches} batch${c.batches === 1 ? "" : "es"} · Home page, Class 10 batches` },
    { href: "/admin/featured", n: c.featured, label: "Featured students", hint: "Out of 10 places · Home page, Our students" },
    { href: "/admin/gallery", n: c.photos, label: "Gallery photos", hint: "Home page, Gallery + the Gallery page" },
    { href: "/admin/sports", n: c.sports, label: "Sports", hint: "Home page, Facilities, Sports centre" },
    { href: "/admin/news", n: c.news, label: "News shown", hint: "Home page, News and notices" },
  ];

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Namaste, {user.displayName}</h1>
          <p>Choose what you want to update. Everything you save appears on the website within a few seconds.</p>
        </div>
        <a className="a-btn yellow" href={SITE_URL} target="_blank" rel="noopener noreferrer">
          Open the website ↗
        </a>
      </div>

      <div className="a-grid">
        {cards.map((card) => (
          <a key={card.href} href={card.href} className="a-stat">
            <b>{card.n}</b>
            <span>{card.label}</span>
            <small>{card.hint}</small>
          </a>
        ))}
        <a href="/admin/settings" className="a-stat">
          <b>Aa</b>
          <span>Website text</span>
          <small>Headline, about text, phone numbers, address</small>
        </a>
      </div>

      <section className="a-card">
        <h2>Recent changes</h2>
        <p>Who changed what on the website.</p>
        {feed.length === 0 ? (
          <p className="a-empty">No changes yet.</p>
        ) : (
          <div className="a-feed">
            {feed.map((f, i) => (
              <div key={i}>
                <span>
                  <b>{f.who}</b> · {f.action}
                </span>
                <time dateTime={new Date(f.at).toISOString()}>
                  {new Date(f.at).toLocaleString("en-GB", { timeZone: "Asia/Kathmandu", dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
