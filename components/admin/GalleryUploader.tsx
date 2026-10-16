"use client";

import { FormEvent, useState } from "react";
import { compressImage } from "./compress";
import type { Result } from "./ActionForm";

const MAX_FILES = 20;

/** Uploads many photos at once, one by one, with progress. */
export default function GalleryUploader({
  action,
  categories,
  liveHref,
}: {
  action: (fd: FormData) => Promise<Result>;
  categories: readonly string[];
  liveHref: string;
}) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("photos") as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) {
      setResult({ ok: false, message: "Choose one or more photos first." });
      return;
    }
    if (files.length > MAX_FILES) {
      setResult({ ok: false, message: `Choose at most ${MAX_FILES} photos at a time.` });
      return;
    }
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const caption = (form.elements.namedItem("caption") as HTMLInputElement).value;

    setBusy(true);
    setResult(null);
    setDone(0);
    setTotal(files.length);
    const failed: string[] = [];
    for (const [i, file] of files.entries()) {
      const fd = new FormData();
      fd.set("category", category);
      fd.set("caption", caption);
      fd.set("photo", await compressImage(file, 1600));
      try {
        const r = await action(fd);
        if (!r.ok) failed.push(`${file.name}: ${r.message}`);
      } catch {
        failed.push(`${file.name}: could not reach the server`);
      }
      setDone(i + 1);
    }
    setBusy(false);
    if (failed.length === 0) {
      form.reset();
      setResult({ ok: true, message: `${files.length} photo${files.length > 1 ? "s" : ""} added. Live on the website now.` });
    } else {
      setResult({
        ok: false,
        message: `${files.length - failed.length} added, ${failed.length} failed. ${failed.slice(0, 3).join(" · ")}`,
      });
    }
  }

  return (
    <form className="a-form" onSubmit={onSubmit}>
      <div className="a-field">
        <label htmlFor="photos">Photos (you can choose many)</label>
        <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} />
        <span className="a-hint">Up to {MAX_FILES} at a time. Large photos are shrunk automatically.</span>
      </div>
      <div className="a-row">
        <div className="a-field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={categories[0]} disabled={busy}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="a-field">
          <label htmlFor="caption">Caption (optional, used for all chosen photos)</label>
          <input id="caption" name="caption" type="text" maxLength={120} placeholder="e.g. Sports Day 2082" disabled={busy} />
        </div>
      </div>
      <div className="a-actions">
        <button type="submit" className="a-btn" disabled={busy}>
          {busy ? `Uploading ${done} of ${total}...` : "Upload photos"}
        </button>
      </div>
      {busy && (
        <div className="a-progress" aria-hidden="true">
          <i style={{ width: `${total ? Math.round((done / total) * 100) : 0}%` }} />
        </div>
      )}
      <div aria-live="polite">
        {result && (
          <p className={result.ok ? "a-msg ok" : "a-msg err"}>
            {result.message}
            {result.ok && (
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
