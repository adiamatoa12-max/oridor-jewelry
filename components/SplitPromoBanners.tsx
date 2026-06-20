import Image from "next/image";
import Link from "next/link";

interface PromoBanner {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  alt: string;
}

const BANNERS: PromoBanner[] = [
  {
    title: "קולקציית הטניס",
    subtitle: "מבצע השקה: קני 2, קבלי 15% הנחה",
    href: "/bracelets",
    image: "/photo/clara_post_4.jpg",
    alt: "דוגמנית עונדת צמיד טניס עדין מכסף",
  },
  {
    title: "אלגנטיות לערב",
    subtitle: "פריטים מובחרים לאירועים בלתי נשכחים",
    href: "/necklaces",
    image: "/photo/clara_post_5.jpg",
    alt: "דוגמנית עונדת תכשיטי כסף משובחים לערב",
  },
];

/**
 * Split promotional banners.
 * Two equal columns on desktop, stacked on mobile. Each is a tall cinematic
 * block with a model image, a delicate light overlay, and centered white text.
 */
export default function SplitPromoBanners() {
  return (
    <section className="my-16 grid w-full grid-cols-1 gap-px md:grid-cols-2 lg:my-24">
      {BANNERS.map((banner) => (
        <Link
          key={banner.title}
          href={banner.href}
          className="group relative flex min-h-[500px] items-center justify-center overflow-hidden"
        >
          {/* Background image */}
          <Image
            src={banner.image}
            alt={banner.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-center transition-transform duration-[1200ms] ease-cinematic group-hover:scale-105"
          />

          {/* Delicate light overlay — keeps it airy while lifting the white text */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/35 via-charcoal/15 to-charcoal/10" />

          {/* Centered content */}
          <div className="relative z-10 px-6 text-center text-canvas">
            <h2 className="text-2xl font-light leading-relaxed tracking-wide text-canvas sm:text-3xl lg:text-4xl">
              {banner.title}
            </h2>
            <p className="mt-4 text-sm font-light tracking-wide text-canvas/90">
              {banner.subtitle}
            </p>
            <span className="mt-8 inline-block border border-white/70 px-8 py-2.5 text-xs font-light tracking-wide text-white transition-all duration-300 ease-cinematic group-hover:bg-white group-hover:text-[#2B2C2F]">
              גלי עוד
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
