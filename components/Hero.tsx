import Link from "next/link";

/**
 * Full-screen cinematic hero.
 * A single full-bleed container — full viewport height on mobile, 90vh on
 * desktop — with a campaign VIDEO as its cover background. A top-to-bottom
 * black gradient guarantees legibility over any frame. The content sits low
 * and centred (below the subject's face) with generous padding, so video and
 * copy read as one deliberate, high-end frame.
 */
export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-mist md:h-[90vh]">
      {/* Cover background video — muted + playsInline + autoPlay so it loops
          silently in the background on every platform (iOS refuses to autoplay
          without muted AND playsInline). object-cover fills the frame at any
          viewport; object-center keeps the subject centred as it crops. The
          poster is the previous hero still, so the first paint is never black
          while the video buffers, and it stands in if a browser blocks
          autoplay. Decorative, so aria-hidden and untabbable. */}
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

      {/* Overlay — two layers for a clean, professional dim (Magnolia-style):
          an even black wash that guarantees consistent contrast for the centred
          white copy wherever the footage is bright, plus a soft top→bottom
          gradient for cinematic depth at the frame edges. Together the video
          still reads clearly while the text stays sharp. */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/40" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45"
      />

      {/* Content — anchored to the LOWER third of the hero, not centred, so the
          model's face (upper-centre of the frame) stays completely clear. The
          hero also runs BELOW the fold (it starts under the in-flow announcement
          bar + navbar and is a full viewport tall), so the large bottom padding
          both clears the fold and lifts the block off the frame edge + the
          floating widgets. */}
      <div className="relative z-10 flex h-full items-end justify-center px-6 pb-56 pt-24 sm:px-8 sm:pb-48">
        {/* Narrow, centred column — capped well short of the full width so the
            headline wraps into a tight, tidy block instead of one long line
            (Magnolia-style), leaving the video and model clear around it. */}
        <div className="mx-auto max-w-xl text-center [filter:drop-shadow(0_2px_14px_rgba(0,0,0,0.55))]">
          {/* Sales headline — bold, compact tracking. No eyebrow label above it:
              it read "מבצע השקה", repeating the first two words of the headline.
              Scales smoothly from mobile to desktop. */}
          <h1 className="animate-fade-up text-[32px] font-bold leading-[1.15] tracking-tight text-white [text-wrap:balance] [animation-delay:100ms] sm:text-5xl lg:text-6xl">
            מבצע השקה מיוחד – 2+1 על פריטים נבחרים
          </h1>

          {/* Dual CTA — generous space below the headline; the two buttons share
              the row equally on mobile. */}
          <div className="mt-8 flex animate-fade-up justify-center gap-3 [animation-delay:300ms] sm:mt-10 sm:gap-4">
            <Link
              href="/collections/moissanite"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center whitespace-nowrap rounded-sm bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:bg-white/90 sm:flex-none sm:px-9"
            >
              קולקציית מואסנייט
            </Link>
            <Link
              href="/collections/silver"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center whitespace-nowrap rounded-sm border border-white/70 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:bg-white hover:text-charcoal sm:flex-none sm:px-9"
            >
              קולקציית כסף 925
            </Link>
          </div>

          {/* Material credentials — restored, but placed at the FOOT of the hero
              block (below the CTAs) rather than under the headline, so it sits in
              the lower band and never crosses the model's face. Smaller, lighter
              and airier than the offer above it. */}
          <p className="mx-auto mt-7 max-w-md animate-fade-up text-[13px] font-light leading-relaxed tracking-wide text-white/85 [animation-delay:500ms] sm:mt-8 sm:text-sm">
            מואסנייט בדרגת D/VVS1, משובץ בכסף סטרלינג 925 בציפוי רודיום. ברק שנשאר, יום אחרי יום.
          </p>
        </div>
      </div>
    </section>
  );
}
