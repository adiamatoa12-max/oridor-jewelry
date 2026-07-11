import Image from "next/image";
import Link from "next/link";

/**
 * Split-layout hero — a clean structural separation of image and content.
 *  · Desktop: two 50/50 columns — image on the left, a solid dark content
 *    panel on the right (RTL reading start). Text is never over the image.
 *  · Mobile: the same split stacked — image on the top half, the solid
 *    content panel on the bottom half. No overlap on any viewport.
 * Order utilities keep the content on the RTL-right of the desktop split
 * while sitting below the image on mobile.
 */
export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Image — top half on mobile, left column on desktop */}
      <div className="relative order-1 h-[50vh] min-h-[300px] bg-mist md:order-2 md:h-auto md:min-h-[640px]">
        <Image
          src="/photo/hero-banner.png"
          alt="קולקציית ההשקה של Oridor — תכשיטי מויסאניט וכסף 925"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Content — solid dark panel, high contrast; bottom half on mobile,
          right column on desktop. Text lives here, never on the image. */}
      <div className="order-2 flex min-h-[50vh] flex-col items-center justify-center bg-ink px-8 py-14 text-center md:order-1 md:min-h-[640px] md:items-start md:px-16 md:py-20 md:text-right xl:px-24">
        <p className="mb-4 animate-fade-up text-xs font-medium uppercase tracking-brand text-gold [animation-delay:100ms]">
          קולקציה חדשה
        </p>
        <h1 className="animate-fade-up text-4xl font-semibold leading-[1.1] tracking-tight text-white [text-wrap:balance] [animation-delay:250ms] sm:text-5xl lg:text-6xl">
          אלגנטיות, מוגדרת מחדש.
        </h1>
        <p className="mt-6 max-w-md animate-fade-up text-base font-light leading-relaxed text-white/75 [animation-delay:450ms] sm:text-lg">
          גלי את קולקציית ההשקה של Oridor. פריטים על-זמניים לאסתטיקה המודרנית.
        </p>
        <div className="animate-fade-up [animation-delay:650ms]">
          <Link href="/shop" className="btn-gold mt-10 inline-flex">
            לרכישת הקולקציה
          </Link>
        </div>
      </div>
    </section>
  );
}
