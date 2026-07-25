import Link from "next/link";

/**
 * Hero — split into two stacked sections:
 *  1. A full-bleed VIDEO banner that plays completely unobstructed (no overlay,
 *     no copy on top).
 *  2. A dedicated TEXT section directly beneath it on a clean solid background,
 *     holding the headline, CTAs and material line.
 *
 * The copy used to float over the video, which covered the model's face and the
 * jewellery; separating them keeps the footage clear and the text perfectly
 * legible on its own surface.
 */
export default function Hero() {
  return (
    <>
      {/* 1 — VIDEO BANNER. Height is capped short of full-screen so the text
          section below peeks above the fold. muted + playsInline + autoPlay is
          the set every platform needs to autoplay silently (iOS refuses without
          muted AND playsInline). object-cover fills the frame; the poster (the
          previous still) avoids a black first paint and stands in if a browser
          blocks autoplay. Decorative → aria-hidden + untabbable. */}
      <section className="relative h-[46svh] min-h-[300px] w-full overflow-hidden bg-mist sm:h-[50vh] lg:h-[56vh]">
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/photo/hero-banner.png"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/video/post_33.mp4" type="video/mp4" />
        </video>
      </section>

      {/* 2 — TEXT SECTION. Its own clean white surface directly under the video,
          with generous padding. Copy is now dark-on-light, so the CTAs flip to
          solid/outline charcoal instead of the white-on-video treatment. */}
      <section className="bg-canvas px-6 pb-12 pt-8 text-center sm:px-8 sm:pb-14 sm:pt-9 lg:pb-16 lg:pt-10">
        <div className="mx-auto max-w-xl">
          {/* Sales headline. Scales smoothly from mobile to desktop; slightly
              smaller than the old over-video size since it no longer competes
              with a busy background. */}
          <h1 className="animate-fade-up text-[26px] font-bold leading-[1.15] tracking-tight text-charcoal [text-wrap:balance] sm:text-4xl lg:text-5xl">
            מבצע השקה מיוחד – 2+1 על פריטים נבחרים
          </h1>

          {/* Dual CTA — solid charcoal + charcoal outline for a light surface.
              The two buttons share the row equally on mobile. */}
          <div className="mt-7 flex animate-fade-up justify-center gap-3 [animation-delay:200ms] sm:mt-8 sm:gap-4">
            <Link
              href="/collections/moissanite"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center whitespace-nowrap rounded-sm bg-charcoal px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-canvas transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:bg-gold hover:text-charcoal sm:flex-none sm:px-9"
            >
              קולקציית מואסנייט
            </Link>
            <Link
              href="/collections/silver"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center whitespace-nowrap rounded-sm border border-charcoal/60 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:border-charcoal hover:bg-charcoal hover:text-canvas sm:flex-none sm:px-9"
            >
              קולקציית כסף 925
            </Link>
          </div>

          {/* Material credentials — quiet supporting line beneath the CTAs. */}
          <p className="mx-auto mt-7 max-w-md animate-fade-up text-[13px] font-light leading-relaxed tracking-wide text-graphite [animation-delay:400ms] sm:mt-8 sm:text-sm">
            מואסנייט בדרגת D/VVS1, משובץ בכסף סטרלינג 925 בציפוי רודיום. ברק שנשאר, יום אחרי יום.
          </p>
        </div>
      </section>
    </>
  );
}
