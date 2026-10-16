"use client";

import { FormEvent, ReactNode, useRef, useState, useTransition } from "react";
import { compressImage } from "./compress";

export type Result = { ok: boolean; message: string };

/**
 * Form that calls a server action, shows a clear success or error message,
 * and shrinks photos first (file inputs with data-max).
 * Fields keep what was typed when there is an error.
 */
export default function ActionForm({
  action,
  children,
  submitLabel,
  pendingLabel = "Saving...",
  resetOnSuccess = false,
  focusAfterReset,
  liveHref,
}: {
  action: (fd: FormData) => Promise<Result>;
  children: ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  resetOnSuccess?: boolean;
  focusAfterReset?: string;
  liveHref?: string;
}) {
  const [result, setResult] = useState<Result | null>(null);
  const [pending, start] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    start(async () => {
      const fd = new FormData(form);
      for (const input of Array.from(form.querySelectorAll<HTMLInputElement>("input[type=file][data-max]"))) {
        const file = input.files?.[0];
        if (file) fd.set(input.name, await compressImage(file, Number(input.dataset.max) || 1600));
      }
      try {
        const r = await action(fd);
        if (!r) return; // the action moved to another page
        setResult(r);
        if (r?.ok && resetOnSuccess) {
          form.reset();
          if (focusAfterReset) form.querySelector<HTMLElement>(`[name="${focusAfterReset}"]`)?.focus();
        }
      } catch (err) {
        // Redirects (for example after sign-in) are thrown on purpose; let Next.js handle them.
        if (err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT")) {
          return;
        }
        setResult({ ok: false, message: "Could not reach the server. Check the internet connection and try again." });
      }
    });
  }

  return (
    <form ref={formRef} className="a-form" onSubmit={onSubmit} onInput={() => result && !result.ok && setResult(null)}>
      {children}
      <div className="a-actions">
        <button type="submit" className="a-btn" disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </button>
      </div>
      <div aria-live="polite">
        {result && (
          <p className={result.ok ? "a-msg ok" : "a-msg err"}>
            {result.message}
            {result.ok && liveHref && (
              <>
                {" "}
                <a href={liveHref} target="_blank" rel="noopener noreferrer">
                  See it on the website
                </a>
              </>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
