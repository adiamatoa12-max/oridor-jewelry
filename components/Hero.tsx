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
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-mist">
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

      {/* Bottom-up dark gradient so the white text pops sharply, while the top
          stays clear to show the jewelry in the video */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content — anchored to the bottom, staggered cinematic fade-up */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 text-center md:pb-32">
        <p className="mb-5 animate-fade-up text-xs tracking-brand text-white/80 [animation-delay:100ms]">
          קולקציה חדשה
        </p>
        <h1 className="mx-auto max-w-3xl animate-fade-up text-4xl font-light leading-relaxed tracking-wide text-white [animation-delay:250ms] md:text-5xl">
          אלגנטיות, מוגדרת מחדש.
        </h1>
        <p className="mx-auto mt-6 max-w-md animate-fade-up text-sm font-light leading-relaxed text-white/85 [animation-delay:450ms]">
          גלי את קולקציית ההשקה של Oridor. פריטים על-זמניים לאסתטיקה המודרנית.
        </p>
        <Link
          href="/necklaces"
          className="mx-auto mt-10 inline-flex min-h-[44px] animate-fade-up items-center justify-center border border-white bg-transparent px-10 py-3 text-sm font-light tracking-wide text-white transition-all duration-300 [animation-delay:650ms] hover:border-gold hover:text-gold"
        >
          לרכישת הקולקציה
        </Link>
      </div>
    </section>
  );
}
