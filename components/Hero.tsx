import Image from "next/image";
import Link from "next/link";

/**
 * Split-screen editorial hero.
 * Two 50/50 columns on desktop: a solid dark text panel and a full-bleed
 * campaign image — the text never overlaps the image. On mobile the columns
 * stack (text on top, image below). Order utilities keep the text on the
 * visual left and the image on the right within the RTL layout.
 */
export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Text panel — solid dark brand background, generous padding */}
      <div className="order-1 flex flex-col justify-center bg-ink px-8 py-16 text-right sm:px-12 md:order-2 md:min-h-[620px] md:py-20 lg:px-16 xl:px-24">
        <p className="mb-4 animate-fade-up text-xs tracking-brand text-gold [animation-delay:100ms]">
          קולקציה חדשה
        </p>
        <h1 className="animate-fade-up text-3xl font-light leading-[1.15] tracking-wide text-white [text-wrap:balance] [animation-delay:250ms] sm:text-4xl lg:text-5xl">
          אלגנטיות, מוגדרת מחדש.
        </h1>
        <p className="mt-5 max-w-md animate-fade-up text-base font-light leading-relaxed text-white/70 [animation-delay:450ms] sm:text-lg">
          גלי את קולקציית ההשקה של Oridor. פריטים על-זמניים לאסתטיקה המודרנית.
        </p>
        <div className="animate-fade-up [animation-delay:650ms]">
          <Link href="/shop" className="btn-lux mt-9 inline-flex">
            לרכישת הקולקציה
          </Link>
        </div>
      </div>

      {/* Image panel — covers its container, centred, no overlay */}
      <div className="relative order-2 min-h-[55vh] bg-mist md:order-1 md:min-h-[620px]">
        <Image
          src="/photo/hero-banner.png"
          alt="קולקציית ההשקה של Oridor — תכשיטי מויסאניט וכסף 925"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
