import Image from "next/image";
import Link from "next/link";

interface PromoBanner {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  alt: string;
  /**
   * Background brightness. "light" backgrounds (e.g. pale marble) get dark
   * text for AA contrast; "dark" backgrounds get white text with a soft shadow.
   */
  tone: "light" | "dark";
}

const BANNERS: PromoBanner[] = [
  {
    // Right banner (first in RTL flow) — light marble background.
    title: "קולקציית הטניס",
    subtitle: "מבצע השקה: קני 2, קבלי 15% הנחה",
    // Dedicated tennis collection page — renders only 'טניס'-named pieces.
    href: "/collection/tennis",
    image: "/photo/clara_post_4.jpg",
    alt: "דוגמנית עונדת צמיד טניס עדין מכסף",
    tone: "light",
  },
  {
    // Left banner — darker, complex background.
    title: "אלגנטיות לערב",
    subtitle: "פריטים מובחרים לאירועים בלתי נשכחים",
    // Dedicated evening-sets page (Evening Elegance).
    href: "/sets",
    image: "/photo/clara_post_5.jpg",
    alt: "דוגמנית עונדת תכשיטי כסף משובחים לערב",
    tone: "dark",
  },
];

/**
 * Split promotional banners.
 * Two equal columns on desktop, stacked on mobile. Each is a tall cinematic
 * block with a model image, a delicate light overlay, and centered white text.
 */
export default function SplitPromoBanners() {
  return (
    <section className="my-14 grid w-full grid-cols-1 gap-px md:grid-cols-2 lg:my-20">
      {BANNERS.map((banner) => {
        const isLight = banner.tone === "light";
        return (
          <Link
            key={banner.title}
            href={banner.href}
            className="group relative flex h-[45vh] max-h-[420px] min-h-[300px] items-center justify-center overflow-hidden"
          >
            {/* Background image */}
            <Image
              src={banner.image}
              alt={banner.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center transition-transform duration-[1200ms] ease-cinematic group-hover:scale-105"
            />

            {/* Overlay — a light scrim lifts dark text on pale marble; a soft
                dark gradient anchors white text on the darker image. */}
            <div
              className={`absolute inset-0 ${
                isLight
                  ? "bg-gradient-to-t from-white/50 via-white/20 to-white/10"
                  : "bg-gradient-to-t from-charcoal/45 via-charcoal/20 to-charcoal/10"
              }`}
            />

            {/* Centered content */}
            <div
              className={`relative z-10 px-6 text-center ${
                isLight ? "text-charcoal" : "text-white [&_*]:drop-shadow-md"
              }`}
            >
              <h2
                className={`text-2xl font-semibold leading-relaxed tracking-wide sm:text-3xl lg:text-4xl ${
                  isLight ? "text-charcoal" : "text-white"
                }`}
              >
                {banner.title}
              </h2>
              <p
                className={`mt-4 text-base font-normal tracking-wide ${
                  isLight ? "text-charcoal" : "text-white"
                }`}
              >
                {banner.subtitle}
              </p>
              <span
                className={`mt-8 inline-block border-2 px-8 py-2.5 text-[11px] font-medium uppercase tracking-[0.25em] backdrop-blur-sm transition-all duration-500 ease-cinematic ${
                  isLight
                    ? "border-platinum/60 text-charcoal hover:bg-canvas hover:text-white"
                    : "border-white/80 bg-charcoal/25 text-white group-hover:border-gold group-hover:bg-gold/25"
                }`}
              >
                גלי עוד
              </span>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
