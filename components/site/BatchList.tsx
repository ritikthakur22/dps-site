"use client";

import { useMemo, useState } from "react";
import type { RankedStudent } from "@/lib/content";
import GradCard from "./GradCard";

export default function BatchList({ students }: { students: RankedStudent[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return students;
    const lower = q.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        (s.nowDoing && s.nowDoing.toLowerCase().includes(lower))
    );
  }, [students, q]);

  return (
    <>
      <div className="batch-search-bar">
        <div className="search-input-wrap">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search graduate by student name or college / higher study pursuit..."
            aria-label="Filter students by name or college"
          />
        </div>
        <div className="search-count">
          Showing <b>{filtered.length}</b> of {students.length} scholars
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-search">
          <p>No graduates found matching "{q}".</p>
          <button type="button" className="btn btn-outline" onClick={() => setQ("")}>
            Reset search filter
          </button>
        </div>
      ) : (
        <div className="grad-grid" style={{ marginTop: 20 }}>
          {filtered.map((s) => (
            <GradCard key={s.id} s={s} />
          ))}
        </div>
      )}
    </>
  );
}
