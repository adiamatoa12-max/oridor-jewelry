"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CardSlide {
  src: string;
  /** Framing classes for this slide (cut-out framing vs cover crop). */
  className: string;
}

/**
 * Mobile-only image carousel for product cards — the touch equivalent of the
 * desktop hover swap.
 *
 * Scroll model — vertical page scroll is NEVER trapped:
 *  - `touch-action: pan-y` (touch-pan-y) tells the browser to ALWAYS keep
 *    vertical panning for the page. A downward drag anywhere on the card
 *    therefore scrolls the page immediately and can never be captured by the
 *    slider — the top priority. (`pan-x` would let the browser axis-lock a
 *    slightly-diagonal drag to horizontal, momentarily stalling page scroll.)
 *  - Horizontal is handled in JS instead: we measure the gesture on touchend
 *    and only switch slides on a DELIBERATE horizontal swipe (dx past a
 *    threshold AND more horizontal than vertical). We never preventDefault, so
 *    a vertical/diagonal drag always falls through to the page untouched.
 *  - The active slide is tracked with an IntersectionObserver (no per-tick
 *    layout reads); arrows scroll programmatically with `scroll-smooth`.
 *  - A plain tap doesn't move the scroller, so it bubbles to the card <Link>.
 *
 * Hidden at sm+; desktop keeps the hover cross-fade.
 */
export default function CardImageCarousel({
  slides,
  alt,
  sizes,
}: {
  slides: CardSlide[];
  alt: string;
  sizes: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Slides whose image failed to load — shown as the first (main) slide's image
  // instead of a broken-image placeholder.
  const [brokenSrcs, setBrokenSrcs] = useState<Set<string>>(() => new Set());
  const markBroken = (src: string) =>
    setBrokenSrcs((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));

  // Track the visible slide via IntersectionObserver — zero layout reads during
  // the scroll, so touch dragging stays buttery. Whichever slide is most in view
  // (>= 60%) becomes active, which drives the arrow show/hide.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            const i = Number((e.target as HTMLElement).dataset.i);
            if (!Number.isNaN(i)) setActive(i);
          }
        }
      },
      { root: el, threshold: [0.6, 0.95] }
    );
    Array.from(el.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [slides.length]);

  // Deliberate-horizontal-swipe detection. `pan-y` disables native horizontal
  // dragging, so we detect a horizontal swipe ourselves and switch slides only
  // when the gesture is clearly sideways — a vertical/diagonal drag is ignored
  // here (and never preventDefault'd), so page scrolling is untouched.
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Ignore anything that isn't a clear, deliberate horizontal swipe.
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    // RTL: a leftward swipe (dx < 0) advances to the next image.
    const dir = dx < 0 ? 1 : -1;
    const next = Math.min(Math.max(active + dir, 0), slides.length - 1);
    if (next !== active) {
      setActive(next);
      scrollToIndex(next);
    }
  };

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (!el || !slide) return;
    // Visual distance from the slide's centre to the track's centre. A relative
    // scrollLeft nudge honours RTL's negative scroll range (which scrollTo would
    // clamp to 0); the track's `scroll-smooth` animates it.
    const delta =
      slide.getBoundingClientRect().left +
      slide.clientWidth / 2 -
      (el.getBoundingClientRect().left + el.clientWidth / 2);
    el.scrollLeft += delta;
  };

  // Arrow step. Inside a <Link>, so we must swallow the click (never navigate).
  const step = (dir: 1 | -1, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = Math.min(Math.max(active + dir, 0), slides.length - 1);
    if (next !== active) {
      setActive(next);
      scrollToIndex(next);
    }
  };

  return (
    <div className="absolute inset-0 z-[1] sm:hidden">
      <div
        ref={trackRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        // touch-action: pan-y set INLINE, not via Tailwind — this build doesn't
        // emit the touch-* utilities, so the class form is a silent no-op. pan-y
        // makes the browser always keep vertical panning for the page, so a
        // downward drag over a card is never trapped by the slider. Horizontal
        // switching is handled by the touch handlers above + the arrows.
        style={{ touchAction: "pan-y" }}
        className="hide-scrollbar flex h-full w-full snap-x snap-mandatory scroll-smooth select-none overflow-x-auto overflow-y-hidden overscroll-x-contain [-webkit-overflow-scrolling:touch]"
      >
        {slides.map((s, i) => {
          const src = brokenSrcs.has(s.src) ? slides[0]?.src ?? s.src : s.src;
          return (
            <div
              key={i}
              data-i={i}
              className="relative h-full w-full flex-none snap-center"
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                draggable={false}
                onError={() => markBroken(s.src)}
                className={s.className}
              />
            </div>
          );
        })}
      </div>

      {/* Sleek side arrows — clean circular controls over the image. Under RTL
          the next image sits to the LEFT, so the left chevron advances and the
          right chevron goes back. Each is hidden at its end of the range. */}
      {active < slides.length - 1 && (
        <button
          type="button"
          aria-label="התמונה הבאה"
          onClick={(e) => step(1, e)}
          className="absolute left-2 top-1/2 z-[2] inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-charcoal shadow-[0_1px_5px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-all duration-200 hover:bg-white active:scale-90"
        >
          <ChevronLeft size={16} strokeWidth={2.25} />
        </button>
      )}
      {active > 0 && (
        <button
          type="button"
          aria-label="התמונה הקודמת"
          onClick={(e) => step(-1, e)}
          className="absolute right-2 top-1/2 z-[2] inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-charcoal shadow-[0_1px_5px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-all duration-200 hover:bg-white active:scale-90"
        >
          <ChevronRight size={16} strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}
