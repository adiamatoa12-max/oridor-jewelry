"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Product-card image with an optional second (lifestyle) shot, accessible on
 * every device.
 *
 *  - Desktop (hover devices): the lifestyle image cross-fades in on hover.
 *  - Mobile (touch): two dots BELOW the image toggle the visible image's `src`
 *    between the studio shot and the lifestyle shot — instant, state-driven, no
 *    horizontal scrolling. The dots sit in the gap just under the photo (not
 *    over it), so they never cover the jewellery, never affect vertical page
 *    scroll, and a plain tap on the image still opens the product.
 *
 * Owns the aspect-ratio image box (via `containerClassName`) so the dots can be
 * placed just outside it — the box itself is `overflow-hidden` for the image
 * crop, which would otherwise clip anything below it. `children` are card
 * overlays (quick-add button, tag) that live inside the image box.
 */
export default function CardImageSwap({
  primary,
  primaryClass,
  lifestyle,
  lifestyleClass = "object-cover object-center",
  alt,
  sizes,
  containerClassName,
  children,
}: {
  primary: string;
  primaryClass: string;
  lifestyle?: string;
  lifestyleClass?: string;
  alt: string;
  sizes: string;
  containerClassName: string;
  children?: React.ReactNode;
}) {
  const [showLifestyle, setShowLifestyle] = useState(false);

  // Dot taps must never bubble to the card <Link> (that would navigate).
  const pick = (toLifestyle: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLifestyle(toLifestyle);
  };

  return (
    // Wrapper is `relative` (no overflow clip) so the dots can sit just below
    // the image box without being cropped and without adding layout height.
    <div className="relative">
      <div className={containerClassName}>
        {lifestyle ? (
          <>
            {/* DESKTOP: hover cross-fade (both hidden on mobile). */}
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

            {/* MOBILE: one image that swaps its src on dot tap. */}
            <div className="absolute inset-0 sm:hidden">
              <Image
                key={showLifestyle ? "lifestyle" : "primary"}
                src={showLifestyle ? lifestyle : primary}
                alt={alt}
                fill
                sizes={sizes}
                className={showLifestyle ? lifestyleClass : primaryClass}
              />
            </div>
          </>
        ) : (
          <Image src={primary} alt={alt} fill sizes={sizes} className={primaryClass} />
        )}

        {children}
      </div>

      {/* Mobile toggle dots — placed in the gap BELOW the photo so they never
          cover the jewellery. Absolutely positioned → no layout shift. */}
      {lifestyle && (
        <div className="pointer-events-none absolute inset-x-0 top-full z-[2] flex items-center justify-center gap-2.5 sm:hidden">
          {[false, true].map((isLifestyle) => {
            const on = showLifestyle === isLifestyle;
            return (
              <button
                key={String(isLifestyle)}
                type="button"
                aria-label={isLifestyle ? "תצוגה על דוגמנית" : "תצוגת סטודיו"}
                aria-pressed={on}
                onClick={pick(isLifestyle)}
                className="pointer-events-auto inline-flex h-4 w-6 items-center justify-center"
              >
                <span
                  className={`h-2 w-2 rounded-full transition-all duration-200 ${
                    on ? "scale-110 bg-charcoal" : "bg-charcoal/30"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
