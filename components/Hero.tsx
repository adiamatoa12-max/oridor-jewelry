import Image from "next/image";
import Link from "next/link";

/**
 * Cinematic hero.
 * Full-bleed campaign image with a soft dark vignette; content sits above it.
 * The image fills a fixed-height section (object-cover, centred) so it stays
 * premium on every viewport with no layout shift and no letterboxing.
 */
export default function Hero() {
  return (
    <section className="relative h-[82vh] max-h-[760px] min-h-[520px] w-full overflow-hidden bg-mist">
      {/* Full-bleed background image — cover + centre, priority for fast LCP */}
      <Image
        src="/photo/hero-banner.png"
        alt="קולקציית ההשקה של Oridor — תכשיטי מויסאניט וכסף 925"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Even, soft vignette so a centred white title reads cleanly across the
          full frame without hiding the imagery behind it. */}
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
