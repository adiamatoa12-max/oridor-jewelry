import Image from "next/image";
import Link from "next/link";

// Category gallery — each tile links to the unified /shop with its category
// pre-selected via the ?filter=<chip label> param (see ShopCatalog). Moissanite
// keeps its dedicated collection page. Hebrew filenames are percent-encoded.
const CATEGORIES = [
  { image: "/photo/category-1.jpeg", label: "שרשראות", href: "/shop?filter=שרשראות" },
  { image: "/photo/category-2.jpeg", label: "טבעות", href: "/shop?filter=טבעות" },
  { image: "/photo/category-5.jpeg", label: "צמידים", href: "/shop?filter=צמידים" },
  { image: "/photo/category-6.jpeg", label: "עגילים", href: "/shop?filter=עגילים" },
  {
    image: "/photo/category-moissanite.jpeg",
    label: "מואסניט",
    href: "/collection/moissanite",
  },
].map((c) => ({ ...c, image: encodeURI(c.image) }));

/**
 * Category gallery (הקולקציות שלנו).
 * A contained, gapped grid of 4:5 category tiles — rounded, object-cover, with a
 * soft dark gradient so the centred label reads cleanly. Consistent padding so
 * nothing touches the screen edges (the "tight", editorial Magnolia look).
 */
export default function InstagramFeed() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          הקולקציות שלנו
        </h2>
        <p className="mt-3 text-sm font-light tracking-wide text-ash">
          קנו לפי קטגוריה
        </p>
      </div>

      {/* Strict 4:5 grid — 2 up on mobile, 5 across on desktop, even gaps. */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-5 lg:gap-6">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.href}
            href={cat.href}
            aria-label={`קטגוריית ${cat.label}`}
            className={`group relative aspect-[4/5] overflow-hidden rounded-xl bg-pearl shadow-card transition-shadow duration-500 ease-out hover:shadow-cardHover ${
              i === CATEGORIES.length - 1 ? "max-sm:col-span-2 max-sm:aspect-[16/9]" : ""
            }`}
          >
            <Image
              src={cat.image}
              alt={`קטגוריית ${cat.label} — Oridor`}
              fill
              sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
              // Serve the raw file directly (skip the Next image optimizer) so
              // the browser requests /photo/<file> — sidesteps any optimizer/CDN
              // cache quirk that can leave a tile blank.
              unoptimized
              // Above-the-fold: eager-load the first row; the rest lazy-load.
              priority={i < 3}
              className="object-cover object-center transition-transform duration-700 ease-cinematic group-hover:scale-105"
            />
            {/* Soft dark gradient so the centred label stays readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/15 to-transparent" />
            <span className="absolute inset-x-0 bottom-5 text-center text-base font-light tracking-[0.15em] text-white transition-colors duration-300 group-hover:text-gold">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
