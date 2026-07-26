"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export interface CardSlide {
  src: string;
  /** Framing classes for this slide (cut-out framing vs cover crop). */
  className: string;
}

/**
 * Mobile-only image carousel for product cards — the touch equivalent of the
 * desktop hover swap.
 *
 * Touch has no hover, so a card's second image was unreachable on mobile. This
 * fills that gap with a real mini-carousel: a native horizontal scroll-snap
 * track (swipeable) plus dot indicators that also tap to switch. It sits inside
 * the card's <Link>, which is why it works cleanly:
 *  - A horizontal SWIPE scrolls the track; the browser fires no click, so it
 *    never navigates.
 *  - A plain TAP doesn't move the scroller, so it bubbles to the <Link> and
 *    opens the product — the behaviour shoppers expect.
 *  - touch-pan-x lets a vertical drag fall through to the page scroll.
 *  - The dots call preventDefault + stopPropagation, so tapping one switches
 *    the image instead of navigating.
 *
 * Hidden at sm+; desktop keeps the hover cross-fade. Rendered absolutely over
 * the card's image frame, so the static desktop image is hidden on mobile to
 * avoid doubling up.
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
  // Touch start point, for detecting a horizontal swipe on touchend.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  // Slides whose image failed to load — shown as the first (main) slide's image
  // instead of a broken-image placeholder.
  const [brokenSrcs, setBrokenSrcs] = useState<Set<string>>(() => new Set());
  const markBroken = (src: string) =>
    setBrokenSrcs((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));

  // Nearest-to-centre tracking, measured from rendered geometry so it stays
  // correct under RTL (where scrollLeft goes negative).
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const centre = el.getBoundingClientRect().left + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const r = child.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - centre);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  };

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (!el || !slide) return;
    // Visual distance from the slide's centre to the track's centre.
    const delta =
      slide.getBoundingClientRect().left +
      slide.clientWidth / 2 -
      (el.getBoundingClientRect().left + el.clientWidth / 2);
    // Assign scrollLeft directly rather than scrollTo/scrollBy: under RTL the
    // scroll range is negative (slide 0 at 0, later slides at negative values),
    // and scrollTo/scrollBy clamp a negative target back to 0 — so they can't
    // reach the left-hand slide. A direct assignment honours the full range.
    el.scrollLeft += delta;
    // Update the indicator here too: a programmatic scrollLeft change doesn't
    // reliably fire the scroll event, so the dot wouldn't otherwise track it.
    setActive(i);
  };

  const goTo = (i: number, e: React.MouseEvent) => {
    // Inside a <Link>: switch the image, never navigate.
    e.preventDefault();
    e.stopPropagation();
    scrollToIndex(i);
  };

  // Horizontal-swipe detection. The track's touch-action is pan-y, so the
  // browser always keeps VERTICAL panning for the page (a downward drag over a
  // card scrolls the page instantly and is never trapped). Horizontal gestures
  // are ignored by the browser here, so we read them ourselves on touchend —
  // and crucially we never call preventDefault, so page scrolling stays fully
  // native. A moved touch isn't a click, so a swipe won't open the product; a
  // still tap falls through to the card's <Link>.
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
    // Only a clearly-horizontal gesture switches the image; anything with a
    // meaningful vertical component was a scroll and is left alone.
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    // dx > 0 (finger dragged right) advances toward the next slide, which sits
    // to the LEFT under RTL; dx < 0 goes back. Clamped to the slide range.
    const next = Math.min(Math.max(active + (dx > 0 ? 1 : -1), 0), slides.length - 1);
    if (next !== active) scrollToIndex(next);
  };

  return (
    <div className="absolute inset-0 z-[1] sm:hidden">
      <div
        ref={trackRef}
        onScroll={onScroll}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        // touch-pan-y: the page always gets vertical scrolling, so a downward
        // drag over a card never gets trapped by the carousel. Horizontal swipes
        // are handled in JS (onTouchEnd) instead of native pan-x, which is what
        // used to capture diagonal gestures and stall the scroll.
        className="hide-scrollbar flex h-full w-full snap-x snap-mandatory touch-pan-y select-none overflow-x-auto overflow-y-hidden overscroll-x-contain"
      >
        {slides.map((s, i) => {
          const src = brokenSrcs.has(s.src) ? slides[0]?.src ?? s.src : s.src;
          return (
            <div key={i} className="relative h-full w-full flex-none snap-center">
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

      {/* Dot indicators — signal that more images exist, and tap to switch.
          Charcoal with a soft glow so they read on both the white cut-out
          slide and a full-bleed lifestyle slide. */}
      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`תמונה ${i + 1}`}
            aria-current={i === active}
            onClick={(e) => goTo(i, e)}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span
              className={`h-1.5 rounded-full shadow-[0_0_3px_rgba(255,255,255,0.7)] transition-all duration-300 ease-out ${
                i === active ? "w-4 bg-charcoal" : "w-1.5 bg-charcoal/40"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
