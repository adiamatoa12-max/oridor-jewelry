import Link from "next/link";

/**
 * Cinematic hero — copy overlaid on a video banner, anchored to the bottom.
 *
 * The video is a CONTAINED banner (a defined height that stays fully on screen)
 * rather than a full-viewport background. That's deliberate: the old full-height
 * hero ran below the fold, so the bottom-anchored copy needed huge padding just
 * to stay visible. With the banner's bottom edge on screen, the copy sits neatly
 * at that edge with normal padding, and both video and text are always visible.
 */
export default function Hero() {
  return (
    <section className="relative h-[68svh] min-h-[460px] w-full overflow-hidden bg-ink sm:h-[70vh] lg:h-[74vh]">
      {/* Cover background video — muted + playsInline + autoPlay so it loops
          silently on every platform (iOS refuses to autoplay without muted AND
          playsInline). object-position lifted to 60% so the subject/jewellery
          sits a touch higher, leaving the plainer lower area behind the copy.
          No poster on purpose: a poster image flashed for a split second before
          playback. Instead the section's dark (bg-ink) surface shows through
          until the first frame paints — a clean dark skeleton that the dimmed
          video transitions straight out of, with no old still ever appearing.
          preload="auto" fetches the clip immediately. Decorative → aria-hidden
          + untabbable. */}
      <video
        className="absolute inset-0 h-full w-full object-cover object-[center_60%]"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/video/post_33.mp4" type="video/mp4" />
      </video>

      {/* Overlay — an even dim for baseline contrast plus a gradient that deepens
          toward the bottom, where the copy sits, so the white text stays sharp
          while the upper video reads clearly. */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/25" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60"
      />

      {/* Content — overlaid and anchored to the bottom edge of the banner with a
          clean, modest padding (no full-height overflow to fight, so no oversized
          bottom padding needed). */}
      <div className="relative z-10 flex h-full items-end justify-center px-6 pb-12 pt-16 sm:px-8 sm:pb-14 lg:pb-16">
        {/* Narrow, centred column so the headline wraps into a tidy block. */}
        <div className="mx-auto max-w-xl text-center [filter:drop-shadow(0_2px_14px_rgba(0,0,0,0.55))]">
          {/* Sales headline. */}
          <h1 className="animate-fade-up text-[28px] font-bold leading-[1.15] tracking-tight text-white [text-wrap:balance] [animation-delay:100ms] sm:text-4xl lg:text-5xl">
            מבצע השקה מיוחד – 2+1 על פריטים נבחרים
          </h1>

          {/* Dual CTA — white / outline-white for the video surface; the two
              buttons share the row equally on mobile. */}
          <div className="mt-6 flex animate-fade-up justify-center gap-3 [animation-delay:300ms] sm:mt-7 sm:gap-4">
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

          {/* Material credentials — quiet supporting line at the foot. */}
          <p className="mx-auto mt-6 max-w-md animate-fade-up text-[13px] font-light leading-relaxed tracking-wide text-white/85 [animation-delay:500ms] sm:mt-7 sm:text-sm">
            מואסנייט בדרגת D/VVS1, משובץ בכסף סטרלינג 925 בציפוי רודיום. ברק שנשאר, יום אחרי יום.
          </p>
        </div>
      </div>
    </section>
  );
}
