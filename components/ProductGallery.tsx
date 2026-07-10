"use client";

import { useState, useRef } from "react";
import Image from "next/image";

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
  const current = gallery[active] ?? gallery[0];
  const fitClass = fit === "cover" ? "object-cover" : "object-contain p-6";

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
      {/* Thumbnail rail */}
      {gallery.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {gallery.map((img, i) => {
            const on = i === active;
            return (
              <button
                key={img.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`תמונה ${i + 1}`}
                aria-current={on}
                className={`relative h-16 w-16 flex-none overflow-hidden rounded-lg bg-white ring-1 transition-all duration-200 sm:h-20 sm:w-20 ${
                  on ? "ring-charcoal" : "ring-platinum/50 hover:ring-charcoal/40"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="80px"
                  className={fit === "cover" ? "object-cover" : "object-contain p-1.5"}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main image with hover-to-zoom */}
      <div
        ref={frameRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        className="relative aspect-[4/5] w-full flex-1 cursor-zoom-in overflow-hidden rounded-xl bg-white ring-1 ring-platinum/40"
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
