"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { usePdpImageSync } from "./PdpImageSync";

export interface GalleryImage {
  src: string;
  alt: string;
  /**
   * Per-image override of the gallery's default fit. Styled/lifestyle shots
   * carry their own background, so they fill the frame ("cover"); transparent
   * product cut-outs sit contained on the frame's own surface.
   */
  fit?: "cover" | "contain";
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
  const trackRef = useRef<HTMLDivElement>(null);
  // True while the user is physically swiping. Scroll events during a
  // programmatic scrollTo would otherwise fight the state we just set.
  const swiping = useRef(false);
  const scrollEnd = useRef<number | undefined>(undefined);

  // Memoised: an inline filter would produce a new array every render, making
  // the sync effect below re-run constantly and fight the clicked thumbnail.
  const gallery = useMemo(() => images.filter((i) => i.src), [images]);

  // Sync with the color swatches: when the buy box picks a variant image,
  // switch the main view to the matching thumbnail. Clicking a thumbnail
  // clears activeSrc, so this stays dormant until a variant is chosen.
  const sync = usePdpImageSync();
  const syncedSrc = sync?.activeSrc;
  useEffect(() => {
    if (!syncedSrc) return;
    const idx = gallery.findIndex((g) => g.src === syncedSrc);
    if (idx >= 0) setActive(idx);
  }, [syncedSrc, gallery]);

  // A synced variant image that isn't one of the local thumbnails (e.g. a live
  // Shopify variant image) becomes the main image directly.
  const overrideSrc =
    sync?.activeSrc && !gallery.some((g) => g.src === sync.activeSrc)
      ? sync.activeSrc
      : null;

  const current: GalleryImage | undefined = overrideSrc
    ? { src: overrideSrc, alt: gallery[0]?.alt ?? "" }
    : gallery[active] ?? gallery[0];

  /** Per-image fit, falling back to the collection default. */
  const fitOf = (img?: GalleryImage) => img?.fit ?? fit;

  // Contained cut-outs get tighter padding (so the piece fills more of the
  // frame instead of floating in whitespace) plus a soft shadow to lift them
  // off the surface. Full-bleed shots simply cover the frame.
  const imageClass = (f: "cover" | "contain") =>
    f === "cover"
      ? "object-cover"
      : "object-contain p-4 [filter:drop-shadow(0px_10px_22px_rgba(0,0,0,0.13))]";

  const currentFit = fitOf(current);

  // Swipe → state. Derived from scroll position rather than touch deltas, so
  // it stays correct through momentum and interrupted flicks.
  //
  // scrollLeft is direction-dependent in RTL (negative in WebKit/Firefox,
  // reversed in Chrome), so we measure against the slide's own offsetLeft
  // instead of assuming a sign — the one bit of RTL maths worth doing by hand.
  const onTrackScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    swiping.current = true;
    const mid = Math.abs(el.scrollLeft) + el.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const d = Math.abs(Math.abs(c.offsetLeft) + c.clientWidth / 2 - mid);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setActive(nearest);
    window.clearTimeout(scrollEnd.current);
    scrollEnd.current = window.setTimeout(() => {
      swiping.current = false;
    }, 120);
  };

  // State → track, so a thumbnail tap or a variant swatch moves the carousel.
  // Skipped mid-swipe: scrolling the track while the user's finger is driving
  // it would yank the image out from under them.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || swiping.current) return;
    const slide = el.children[active] as HTMLElement | undefined;
    if (!slide) return;
    el.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }, [active]);

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
          while the rest sit gently dimmed, with a soft scale on hover.
          Hidden on mobile: the swipe track and its dots are the control there,
          so a second rail below them is redundant. Desktop keeps the rail,
          since a mouse has no swipe affordance. */}
      {gallery.length > 1 && (
        <div className="hidden gap-3.5 sm:flex sm:flex-col">
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
                className={`relative h-20 w-20 flex-none overflow-hidden rounded-lg bg-cream ring-1 transition-all duration-300 ease-out hover:scale-105 sm:h-24 sm:w-24 ${
                  on
                    ? "opacity-100 ring-gold/50"
                    : "opacity-70 ring-platinum/40 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="96px"
                  className={
                    fitOf(img) === "cover" ? "object-cover" : "object-contain p-1.5"
                  }
                />
              </button>
            );
          })}
        </div>
      )}

      {/* MOBILE — a real swipe carousel. Native scroll-snap rather than a JS
          drag library: it inherits the platform's own momentum, rubber-banding
          and RTL handling, which hand-rolled touch maths never quite matches.
          Hidden at sm+, where the hover-zoom frame below takes over. */}
      <div className="w-full flex-1 sm:hidden">
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="hide-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl"
        >
          {gallery.map((img) => (
            <div
              key={img.src}
              className="relative aspect-[4/5] w-full flex-none snap-center bg-cream ring-1 ring-platinum/40"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={img.src === gallery[0]?.src}
                sizes="100vw"
                className={`${imageClass(fitOf(img))} object-center ${
                  fitOf(img) === "contain" ? "scale-[1.08]" : ""
                }`}
              />
            </div>
          ))}
        </div>

        {/* Dot indicators — the affordance that tells a shopper more images
            exist. Presentational only; the track above is the control. */}
        {gallery.length > 1 && (
          <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
            {gallery.map((img, i) => (
              <span
                key={img.src}
                className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                  i === active ? "w-5 bg-charcoal" : "w-1.5 bg-platinum"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP — main image with hover-to-zoom. */}
      <div
        ref={frameRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        className="relative hidden aspect-[4/5] w-full flex-1 cursor-zoom-in overflow-hidden rounded-2xl bg-cream ring-1 ring-platinum/40 sm:block"
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="45vw"
          style={{ transformOrigin: origin }}
          className={`${imageClass(currentFit)} object-center transition-transform duration-300 ease-out ${
            zoom
              ? "scale-[1.7]"
              : currentFit === "contain"
                ? "scale-[1.08]"
                : "scale-100"
          }`}
        />
      </div>
    </div>
  );
}
