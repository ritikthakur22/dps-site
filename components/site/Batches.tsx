"use client";

import { useState } from "react";
import type { Batch } from "@/lib/content";
import GradCard from "./GradCard";

export default function Batches({ batches }: { batches: Batch[] }) {
  const [year, setYear] = useState(batches[0]?.year);
  if (batches.length === 0) return null;
  const batch = batches.find((b) => b.year === year) ?? batches[0];

  return (
    <section id="batches" className="section soft">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Academic Roll of Honor</div>
          <h2 className="h2">Secondary Education Examination (SEE) board results.</h2>
          <p className="lead" style={{ marginTop: 10 }}>
            Daffodils scholars consistently achieve outstanding results in the Class 10 national board examinations,
            with our graduates securing placements in prestigious medical, engineering, and science faculties across Nepal.
          </p>
        </div>

        {batches.length > 1 && (
          <div className="batch-years" role="group" aria-label="Select batch year">
            {batches.map((b) => (
              <button
                key={b.year}
                type="button"
                className="tab"
                aria-pressed={b.year === batch.year}
                onClick={() => setYear(b.year)}
              >
                Batch {b.year} B.S.
              </button>
            ))}
          </div>
        )}

        <div className="batch-meta">
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>Batch of {batch.year} B.S.</h3>
            <span style={{ fontSize: 13, color: "var(--c-muted)" }}>
              {batch.total > batch.top.length
                ? `Displaying top ${batch.top.length} of ${batch.total} graduates, ranked by National Board GPA`
                : `${batch.total} graduates, ranked by National Board GPA`}
            </span>
          </div>
          <div className="batch-pill-note">
            ★ 100% SEE Board Success Track Record
          </div>
        </div>

        <div className="grad-grid">
          {batch.top.map((s) => (
            <GradCard key={s.id} s={s} />
          ))}
        </div>

        {batch.total > batch.top.length && (
          <div className="more-row">
            <a href={`/batches/${batch.year}`} className="btn btn-ink">
              View all {batch.total} graduates of batch {batch.year}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
