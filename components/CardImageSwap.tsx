"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Product-card image with a second (lifestyle) shot, accessible on every device.
 *
 *  - Desktop (hover devices): the lifestyle image cross-fades in on hover — two
 *    stacked images, `hidden sm:block`, opacity driven by `group-hover`.
 *  - Mobile (touch): a SINGLE image whose `src` swaps between the studio shot
 *    and the lifestyle shot when the dots below are tapped. Pure React state and
 *    a plain `src` change — NO horizontal scrolling and NO opacity/media tricks —
 *    so it toggles instantly and reliably on any phone, never affects vertical
 *    page scroll, and a plain tap on the image still opens the product.
 */
export default function CardImageSwap({
  primary,
  primaryClass,
  lifestyle,
  lifestyleClass = "object-cover object-center",
  alt,
  sizes,
}: {
  primary: string;
  primaryClass: string;
  lifestyle: string;
  lifestyleClass?: string;
  alt: string;
  sizes: string;
}) {
  const [showLifestyle, setShowLifestyle] = useState(false);

  // Dot taps must never bubble to the card <Link> (that would navigate).
  const pick = (toLifestyle: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLifestyle(toLifestyle);
  };

  return (
    <>
      {/* DESKTOP: hover cross-fade. Both hidden on mobile. */}
      <Image
        src={primary}
        alt={alt}
        fill
        sizes={sizes}
        className={`${primaryClass} hidden sm:block`}
      />
      <Image
        src={lifestyle}
        alt={`${alt} בתמונת אווירה`}
        fill
        sizes={sizes}
        className={`${lifestyleClass} hidden opacity-0 transition-opacity duration-500 ease-cinematic group-hover:opacity-100 sm:block`}
      />

      {/* MOBILE: one image that swaps its src on dot tap, plus the dots. */}
      <div className="absolute inset-0 sm:hidden">
        <Image
          key={showLifestyle ? "lifestyle" : "primary"}
          src={showLifestyle ? lifestyle : primary}
          alt={alt}
          fill
          sizes={sizes}
          className={showLifestyle ? lifestyleClass : primaryClass}
        />

        {/* Toggle dots — a clear, instant way to see the second image on a phone. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2.5 z-[2] flex items-center justify-center gap-2">
          {[false, true].map((isLifestyle) => {
            const on = showLifestyle === isLifestyle;
            return (
              <button
                key={String(isLifestyle)}
                type="button"
                aria-label={isLifestyle ? "תצוגה על דוגמנית" : "תצוגת סטודיו"}
                aria-pressed={on}
                onClick={pick(isLifestyle)}
                // Generous 24px tap target around an 8px dot.
                className="pointer-events-auto inline-flex h-6 w-6 items-center justify-center"
              >
                <span
                  className={`h-2 w-2 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.75)] transition-all duration-200 ${
                    on ? "scale-110 bg-charcoal" : "bg-charcoal/35"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
