"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePdpImageSync } from "./PdpImageSync";

export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Premium PDP image gallery.
 * - Large main image with a smooth hover-to-zoom (follows the cursor).
 * - A slim thumbnail rail (side on desktop, row on mobile) to switch views.
 * - `contain` fit on a soft white surface so studio shots sit cleanly.
 */
export default function ProductGallery({
  images,
  fit = "contain",
}: {
  images: GalleryImage[];
  fit?: "cover" | "contain";
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const frameRef = useRef<HTMLDivElement>(null);

  const gallery = images.filter((i) => i.src);

  // Sync with the color swatches: when the buy box picks a variant image,
  // switch the main view to the matching thumbnail.
  const sync = usePdpImageSync();
  useEffect(() => {
    const src = sync?.activeSrc;
    if (!src) return;
    const idx = gallery.findIndex((g) => g.src === src);
    if (idx >= 0) setActive(idx);
  }, [sync?.activeSrc, gallery]);

  // A synced variant image that isn't one of the local thumbnails (e.g. a live
  // Shopify variant image) becomes the main image directly.
  const overrideSrc =
    sync?.activeSrc && !gallery.some((g) => g.src === sync.activeSrc)
      ? sync.activeSrc
      : null;

  const current = overrideSrc
    ? { src: overrideSrc, alt: gallery[0]?.alt ?? "" }
    : gallery[active] ?? gallery[0];
  const fitClass =
    fit === "cover"
      ? "object-cover"
      : "object-contain p-6 [filter:drop-shadow(0px_8px_20px_rgba(0,0,0,0.10))]";

  const onMove = (e: React.MouseEvent) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  if (!current) return null;

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-5">
      {/* Thumbnail rail — borderless; the active thumb reads full-strength
          while the rest sit gently dimmed, with a soft scale on hover. */}
      {gallery.length > 1 && (
        <div className="flex gap-3.5 sm:flex-col">
          {gallery.map((img, i) => {
            const on = i === active;
            return (
              <button
                key={img.src}
                type="button"
                onClick={() => {
                  setActive(i);
                  sync?.setActiveSrc(null); // let the clicked thumbnail win
                }}
                aria-label={`תמונה ${i + 1}`}
                aria-current={on}
                className={`relative h-20 w-20 flex-none overflow-hidden rounded-lg bg-transparent transition-all duration-300 ease-out hover:scale-105 sm:h-24 sm:w-24 ${
                  on ? "opacity-100" : "opacity-45 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="96px"
                  className={fit === "cover" ? "object-cover" : "object-contain p-1"}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main image with hover-to-zoom — seamless, no box: the piece floats on
          the page background. */}
      <div
        ref={frameRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        className="relative aspect-[4/5] w-full flex-1 cursor-zoom-in overflow-hidden bg-transparent"
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 768px) 45vw, 100vw"
          style={{ transformOrigin: origin }}
          className={`${fitClass} object-center transition-transform duration-300 ease-out ${
            zoom ? "scale-[1.7]" : "scale-100"
          }`}
        />
      </div>
    </div>
  );
}
