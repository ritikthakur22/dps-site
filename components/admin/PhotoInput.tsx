"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function PhotoInput({
  name = "photo",
  label = "Photo",
  current,
  maxSide = 1200,
  allowRemove = false,
  required = false,
  hint,
}: {
  name?: string;
  label?: string;
  current?: string | null;
  maxSide?: number;
  allowRemove?: boolean;
  required?: boolean;
  hint?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const form = input.current?.form;
    if (!form) return;
    const onReset = () => setPreview(null);
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const shown = preview ?? current ?? null;

  return (
    <div className="a-field">
      <label htmlFor={id}>{label}</label>
      <div className="a-photo">
        <div className="a-photo-preview">{shown ? <img src={shown} alt="" /> : "No photo"}</div>
        <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
          <input
            ref={input}
            id={id}
            name={name}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            data-max={maxSide}
            required={required}
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
          />
          <span className="a-hint">{hint ?? "JPG or PNG. Large phone photos are shrunk automatically."}</span>
          {allowRemove && current && (
            <label className="a-check">
              <input type="checkbox" name="removePhoto" /> Remove the current photo
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
