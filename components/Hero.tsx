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
        <div className="mx-auto max-w-xl text-center [filter:drop-shadow(0_2px_12px_rgba(0,0,0,0.6))]">
          <p className="mb-6 animate-fade-up text-xs font-medium uppercase tracking-[0.4em] text-gold [animation-delay:100ms]">
            קולקציה חדשה
          </p>
          <h1 className="animate-fade-up text-[2.75rem] font-bold leading-[1.14] tracking-wide text-white [text-wrap:balance] [animation-delay:250ms] sm:text-6xl lg:text-7xl">
            אלגנטיות, מוגדרת מחדש.
          </h1>
          <p className="mx-auto mt-8 max-w-md animate-fade-up text-sm font-light leading-loose tracking-wide text-white/80 [animation-delay:450ms] sm:text-base">
            פריטים על-זמניים לאסתטיקה המודרנית.
          </p>
          <div className="animate-fade-up [animation-delay:650ms]">
            <Link href="/shop" className="btn-gold mt-12 inline-flex">
              צפייה בקולקציה
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
