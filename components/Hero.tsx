import Link from "next/link";

// Poster shown while the video loads / if it can't play (e.g. data-saver, iOS
// low-power mode). Kept as a graceful fallback behind the background video.
const HERO_POSTER =
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000";

/**
 * Cinematic hero.
 * Full-bleed autoplaying campaign video with a dark overlay; content sits above
 * it. The video sits at the back via DOM order (a negative z-index would paint
 * it behind the section's own background).
 */
export default function Hero() {
  return (
    <section className="relative h-[82vh] max-h-[760px] min-h-[520px] w-full overflow-hidden bg-mist">
      {/* Full-bleed background video — autoplay, muted & inline for iOS */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={HERO_POSTER}
        aria-hidden="true"
      >
        <source src="/video/clara_post_6.mp4" type="video/mp4" />
      </video>

      {/* Even, soft vignette so a centred white title reads cleanly across the
          full frame without hiding the lifestyle imagery behind it. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/40" />

      {/* Content — elegantly centred, staggered cinematic fade-up */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 animate-fade-up text-xs tracking-brand text-white/90 [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.55))] [animation-delay:100ms]">
          קולקציה חדשה
        </p>
        <h1 className="mx-auto max-w-3xl animate-fade-up text-3xl font-light leading-[1.15] tracking-wide text-white [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.55))] [animation-delay:250ms] [text-wrap:balance] sm:text-4xl md:text-5xl">
          <span className="inline-block animate-soft-float motion-reduce:animate-none">
            אלגנטיות, מוגדרת מחדש.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-md animate-fade-up text-base font-light leading-relaxed text-white [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.55))] [animation-delay:450ms] sm:text-lg">
          גלי את קולקציית ההשקה של Oridor. פריטים על-זמניים לאסתטיקה המודרנית.
        </p>
        <Link
          href="/shop"
          className="btn-lux mt-9 animate-fade-up [animation-delay:650ms]"
        >
          לרכישת הקולקציה
        </Link>
      </div>
    </section>
  );
}
