"use client";

import { useState, useTransition } from "react";
import type { Result } from "./ActionForm";

/** A button that runs a server action. With `confirm`, it asks first (in the page, no pop-up). */
export default function ActionButton({
  action,
  label,
  confirm,
  confirmLabel = "Yes, delete",
  variant = "ghost",
}: {
  action: () => Promise<Result>;
  label: string;
  confirm?: string;
  confirmLabel?: string;
  variant?: "ghost" | "danger" | "primary";
}) {
  const [asking, setAsking] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const cls = `a-btn small ${variant === "primary" ? "" : variant}`;

  function go() {
    setError(null);
    start(async () => {
      try {
        const r = await action();
        if (!r.ok) setError(r.message);
        setAsking(false);
      } catch {
        setError("Could not reach the server. Try again.");
      }
    });
  }

  if (asking) {
    return (
      <span className="a-actions" role="group" aria-label="Confirm">
        <span style={{ fontWeight: 700 }}>{confirm}</span>
        <button type="button" className="a-btn small danger solid" onClick={go} disabled={pending}>
          {pending ? "Working..." : confirmLabel}
        </button>
        <button type="button" className="a-btn small ghost" onClick={() => setAsking(false)} disabled={pending}>
          Cancel
        </button>
      </span>
    );
  }

  return (
    <span className="a-actions">
      <button type="button" className={cls} onClick={() => (confirm ? setAsking(true) : go())} disabled={pending}>
        {pending ? "Working..." : label}
      </button>
      {error && (
        <span className="a-msg err" role="alert" style={{ padding: "6px 10px" }}>
          {error}
        </span>
      )}
    </span>
  );
}
