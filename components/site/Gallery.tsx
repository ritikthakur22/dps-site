"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GalleryPhoto } from "@/lib/content";
import { imageUrl } from "@/lib/images";

export default function Gallery({ photos, filter = false }: { photos: GalleryPhoto[]; filter?: boolean }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(photos.map((p) => p.category)))], [photos]);
  const [active, setActive] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const visible = active === "All" ? photos : photos.filter((p) => p.category === active);
  const currentPhoto = selectedIndex !== null ? visible[selectedIndex] : null;

  function show(index: number) {
    setSelectedIndex(index);
    dialog.current?.showModal();
  }

  function close() {
    dialog.current?.close();
    setSelectedIndex(null);
  }

  function prev() {
    if (selectedIndex === null) return;
    setSelectedIndex((idx) => (idx! > 0 ? idx! - 1 : visible.length - 1));
  }

  function next() {
    if (selectedIndex === null) return;
    setSelectedIndex((idx) => (idx! < visible.length - 1 ? idx! + 1 : 0));
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!dialog.current?.open) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <>
      {filter && categories.length > 2 && (
        <div className="tabs" role="group" aria-label="Filter photos" style={{ marginTop: 24 }}>
          {categories.map((c) => (
            <button key={c} type="button" className="tab" aria-pressed={active === c} onClick={() => setActive(c)}>
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="gallery-grid">
        {visible.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            className="shot"
            onClick={() => show(idx)}
            aria-label={p.caption ?? `${p.category} photo`}
          >
            <img src={imageUrl(p.photoUrl, "card") ?? ""} alt="" width={640} height={480} loading="lazy" decoding="async" />
            <div className="shot-overlay">
              <span className="shot-cat">{p.category}</span>
              {p.caption && <span className="shot-cap">{p.caption}</span>}
            </div>
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        onClose={() => setSelectedIndex(null)}
        onClick={(e) => e.target === dialog.current && close()}
      >
        {currentPhoto && (
          <div className="lightbox-content">
            <button type="button" className="lightbox-close" onClick={close} aria-label="Close photo preview">
              ✕
            </button>

            {visible.length > 1 && (
              <>
                <button type="button" className="lightbox-nav lightbox-prev" onClick={prev} aria-label="Previous photo">
                  ‹
                </button>
                <button type="button" className="lightbox-nav lightbox-next" onClick={next} aria-label="Next photo">
                  ›
                </button>
              </>
            )}

            <div className="lightbox-image-wrap">
              <img
                src={imageUrl(currentPhoto.photoUrl, "large") ?? ""}
                alt={currentPhoto.caption ?? `${currentPhoto.category} photo`}
              />
            </div>

            <div className="lightbox-caption-bar">
              <span className="lightbox-cat-badge">{currentPhoto.category}</span>
              {currentPhoto.caption && <p className="lightbox-title">{currentPhoto.caption}</p>}
              <span className="lightbox-counter">
                {selectedIndex! + 1} of {visible.length}
              </span>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
