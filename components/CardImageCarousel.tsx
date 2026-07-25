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

  const goTo = (i: number, e: React.MouseEvent) => {
    // Inside a <Link>: switch the image, never navigate.
    e.preventDefault();
    e.stopPropagation();
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
    // reliably fire the scroll event, so the dot wouldn't otherwise track a tap.
    // (A real swipe fires scroll natively, which onScroll handles.)
    setActive(i);
  };

  return (
    <div className="absolute inset-0 z-[1] sm:hidden">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="hide-scrollbar flex h-full w-full snap-x snap-mandatory touch-pan-x select-none overflow-x-auto overflow-y-hidden overscroll-x-contain"
      >
        {slides.map((s, i) => (
          <div key={i} className="relative h-full w-full flex-none snap-center">
            <Image
              src={s.src}
              alt={alt}
              fill
              sizes={sizes}
              draggable={false}
              className={s.className}
            />
          </div>
        ))}
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
