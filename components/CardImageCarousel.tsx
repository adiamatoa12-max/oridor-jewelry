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
 * Performance model: the track is a NATIVE horizontal scroll-snap container.
 *  - `touch-action: pan-x` (touch-pan-x) hands horizontal drags to the browser's
 *    own compositor-driven scroller, so a swipe follows the finger with real
 *    momentum and snapping — no JS in the gesture path, no sticking. A vertical
 *    drag is left to the page, so downward scrolling passes straight through.
 *  - The active slide is tracked with an IntersectionObserver, so there is NO
 *    per-scroll-tick layout reading (the old getBoundingClientRect-in-onScroll
 *    was the source of the jank).
 *  - Arrows scroll programmatically; `scroll-smooth` animates those fluidly.
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
        // touch-pan-x: native, compositor-driven horizontal swipe (fluid, with
        // momentum + snap); vertical drags fall through to the page scroll.
        // -webkit-overflow-scrolling:touch keeps legacy iOS momentum on.
        className="hide-scrollbar flex h-full w-full snap-x snap-mandatory scroll-smooth touch-pan-x select-none overflow-x-auto overflow-y-hidden overscroll-x-contain [-webkit-overflow-scrolling:touch]"
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
