import Image from "next/image";
import Link from "next/link";

/**
 * Full-screen overlay hero (Drice-style).
 * A single full-width container at a fixed height with the campaign image as
 * its cover background. A directional dark gradient — heaviest on the content
 * (RTL-right) side — keeps the Hebrew text sharp. Title, description and CTA
 * sit on top, aligned right and vertically centred, so image and copy read as
 * one cohesive block.
 */
export default function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden bg-mist md:h-[90vh]">
      {/* Cover background image */}
      <Image
        src="/photo/hero-banner.png"
        alt="קולקציית ההשקה של Oridor — תכשיטי מויסאניט וכסף 925"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark gradient — heaviest on the right (where the text sits), fading
          left so the jewellery still breathes. Keeps the copy fully readable. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/45 to-black/10"
      />

      {/* Content — vertically centred, aligned to the RTL-right side */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="max-w-xl text-right [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.55))]">
            <p className="mb-4 animate-fade-up text-xs font-medium uppercase tracking-brand text-gold [animation-delay:100ms]">
              קולקציה חדשה
            </p>
            <h1 className="animate-fade-up text-4xl font-semibold leading-[1.1] tracking-tight text-white [text-wrap:balance] [animation-delay:250ms] sm:text-5xl lg:text-6xl">
              אלגנטיות, מוגדרת מחדש.
            </h1>
            <p className="mt-6 max-w-md animate-fade-up text-base font-light leading-relaxed text-white/85 [animation-delay:450ms] sm:text-lg">
              גלי את קולקציית ההשקה של Oridor. פריטים על-זמניים לאסתטיקה המודרנית.
            </p>
            <div className="animate-fade-up [animation-delay:650ms]">
              <Link href="/shop" className="btn-gold mt-10 inline-flex">
                לרכישת הקולקציה
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
