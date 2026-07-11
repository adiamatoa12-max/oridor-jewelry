import Image from "next/image";
import Link from "next/link";

/**
 * Hero — two experiences from one structure:
 *  · Mobile: a unified image-overlay hero. The banner is the full 80vh
 *    background, a dark gradient sits between it and the text, and the copy +
 *    CTA are centred on top.
 *  · Desktop (md+): a 50/50 editorial split — solid dark text panel on the
 *    left, image on the right, no overlay.
 * Order utilities keep the text on the visual left of the RTL desktop split.
 */
export default function Hero() {
  return (
    <section className="relative h-[80vh] max-h-[720px] min-h-[520px] w-full md:h-auto md:max-h-none md:grid md:min-h-0 md:grid-cols-2">
      {/* Image — full background on mobile; right-hand grid column on desktop */}
      <div className="absolute inset-0 bg-mist md:relative md:inset-auto md:order-1 md:min-h-[620px]">
        <Image
          src="/photo/hero-banner.png"
          alt="קולקציית ההשקה של Oridor — תכשיטי מויסאניט וכסף 925"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Mobile-only gradient — darkens the image so the Hebrew text stays
          perfectly readable. Hidden on desktop (text has its own dark panel). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/45 md:hidden"
      />

      {/* Text — centred overlay on mobile; solid dark left panel on desktop */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 py-16 text-center [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.5))] md:order-2 md:h-auto md:min-h-[620px] md:items-stretch md:bg-ink md:px-16 md:py-20 md:text-right md:[filter:none] lg:px-16 xl:px-24">
        <p className="mb-4 animate-fade-up text-xs tracking-brand text-gold [animation-delay:100ms]">
          קולקציה חדשה
        </p>
        <h1 className="animate-fade-up text-4xl font-light leading-[1.15] tracking-wide text-white [text-wrap:balance] [animation-delay:250ms] sm:text-5xl lg:text-5xl">
          אלגנטיות, מוגדרת מחדש.
        </h1>
        <p className="mt-5 max-w-md animate-fade-up text-base font-light leading-relaxed text-white/80 [animation-delay:450ms] sm:text-lg md:text-white/70">
          גלי את קולקציית ההשקה של Oridor. פריטים על-זמניים לאסתטיקה המודרנית.
        </p>
        <div className="animate-fade-up [animation-delay:650ms]">
          <Link href="/shop" className="btn-lux mt-9 inline-flex">
            לרכישת הקולקציה
          </Link>
        </div>
      </div>
    </section>
  );
}
