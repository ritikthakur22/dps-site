"use client";

import { useMemo, useState } from "react";
import type { Highlight } from "@/lib/content";
import { imageUrl, initials } from "@/lib/images";

export default function Showcase({ items }: { items: Highlight[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const [active, setActive] = useState("All");
  if (items.length === 0) return null;
  const visible = active === "All" ? items : items.filter((i) => i.category === active);

  const getBadgeClass = (cat: string) => {
    const l = cat.toLowerCase();
    if (l.includes("acad")) return "badge-cat badge-acad";
    if (l.includes("sport")) return "badge-cat badge-sport";
    if (l.includes("art")) return "badge-cat badge-art";
    return "badge-cat badge-beyond";
  };

  return (
    <section id="showcase" className="section">
      <div className="wrap">
        <div className="show-head">
          <div>
            <div className="eyebrow">Student Honors & Talent</div>
            <h2 className="h2">Individual accomplishments and competition honors.</h2>
            <p className="lead" style={{ marginTop: 10 }}>
              Recognizing scholars who distinguish themselves in inter-school Olympiads, district athletic championships,
              and community leadership.
            </p>
          </div>
          {categories.length > 2 && (
            <div className="tabs" role="group" aria-label="Filter achievements by category">
              {categories.map((c) => (
                <button key={c} type="button" className="tab" aria-pressed={active === c} onClick={() => setActive(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="student-grid">
          {visible.map((s) => {
            const src = imageUrl(s.photoUrl, "card");
            return (
              <article key={s.id} className="student-card">
                <div className="student-photo">
                  <span className={getBadgeClass(s.category)}>{s.category}</span>
                  {src ? (
                    <img
                      src={src}
                      alt={`${s.name}, ${s.grade}`}
                      width={640}
                      height={480}
                      loading="lazy"
                      decoding="async"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="student-avatar" aria-hidden="true">
                      {initials(s.name)}
                    </div>
                  )}
                </div>
                <div className="student-body">
                  <span className="student-grade-pill">{s.grade}</span>
                  <h3 className="student-name">{s.name}</h3>
                  <p className="student-achievement">{s.achievement}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
