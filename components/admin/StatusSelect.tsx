"use client";

import { useState, useTransition } from "react";
import type { Result } from "./ActionForm";

const LABELS: Record<string, string> = {
  new: "New",
  contacted: "Called",
  visited: "Visited school",
  admitted: "Admitted",
  closed: "Closed",
};

export default function StatusSelect({
  id,
  value,
  action,
}: {
  id: string;
  value: string;
  action: (status: string) => Promise<Result>;
}) {
  const [current, setCurrent] = useState(value);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="a-field" style={{ minWidth: 170 }}>
      <label htmlFor={id} className="a-hint">
        Status {pending && "(saving...)"}
      </label>
      <select
        id={id}
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          const prev = current;
          setCurrent(next);
          setError(null);
          start(async () => {
            const r = await action(next).catch(() => ({ ok: false, message: "Could not save. Try again." }));
            if (!r.ok) {
              setCurrent(prev);
              setError(r.message);
            }
          });
        }}
      >
        {Object.entries(LABELS).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      {error && <span className="a-msg err">{error}</span>}
    </span>
  );
}
