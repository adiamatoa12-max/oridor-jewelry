import Image from "next/image";
import Link from "next/link";

/**
 * Full-screen cinematic hero.
 * A single full-bleed container — full viewport height on mobile, 90vh on
 * desktop — with the campaign image as its cover background. A top-to-bottom
 * black gradient guarantees legibility over any image. The content sits low
 * and centred (below the subject's face) with generous padding, so image and
 * copy read as one deliberate, high-end frame.
 */
export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-mist md:h-[90vh]">
      {/* Cover background image */}
      <Image
        src="/photo/hero-banner.png"
        alt="קולקציית ההשקה של Oridor — תכשיטי מויסאניט וכסף 925"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Full dark gradient — light at top, heavy at the bottom where the copy
          sits — so the Hebrew stays sharp against any part of the image. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/75"
      />

      {/* Content — centred both axes, clear of the subject's face and the
          bottom-anchored floating widgets, with generous breathing room. */}
      <div className="relative z-10 flex h-full items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-2xl text-center [filter:drop-shadow(0_2px_12px_rgba(0,0,0,0.6))]">
          {/* Sales headline — extremely bold, compact tracking. No eyebrow
              label above it: it read "מבצע השקה", repeating the first two words
              of the headline itself. */}
          <h1 className="animate-fade-up text-4xl font-bold leading-[1.14] tracking-tight text-white [text-wrap:balance] [animation-delay:100ms] sm:text-5xl lg:text-6xl">
            מבצע השקה מיוחד – 2+1 על פריטים נבחרים
          </h1>
          {/* Supporting line — smaller, lighter, airier */}
          <p className="mx-auto mt-6 max-w-lg animate-fade-up text-sm font-light leading-relaxed tracking-wide text-white/85 [animation-delay:300ms] sm:text-base">
            תכשיטי מואסניט באיכות פרימיום (D/VVS1) – ברק של יהלום, עד הבית.
          </p>

          {/* Dual CTA — high-contrast, near-square corners, side-by-side with a
              gap; the two buttons share the row equally on mobile. */}
          <div className="mt-10 flex animate-fade-up justify-center gap-4 [animation-delay:500ms]">
            <Link
              href="/collections/moissanite"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center whitespace-nowrap rounded-sm bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:bg-white/90 sm:flex-none sm:px-9"
            >
              קולקציית מואסניט
            </Link>
            <Link
              href="/collections/silver"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center whitespace-nowrap rounded-sm border border-white/70 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:bg-white hover:text-charcoal sm:flex-none sm:px-9"
            >
              קולקציית כסף 925
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
