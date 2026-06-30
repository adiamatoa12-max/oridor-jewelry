import Image from "next/image";
import Link from "next/link";

// Category gallery — each tile shows a collection photo, a category label, and
// links to that category. Hebrew filenames are percent-encoded (encodeURI) so
// the paths resolve without 404s.
const CATEGORIES = [
  { image: "/photo/קולקצית.jpeg", label: "שרשראות", href: "/necklaces" },
  { image: "/photo/קוליקצת 2.jpeg", label: "טבעות", href: "/rings" },
  { image: "/photo/קולקצית 5.jpeg", label: "צמידים", href: "/bracelets" },
  { image: "/photo/קולקצית 6.jpeg", label: "עגילים", href: "/earrings" },
  {
    image: "/photo/קולקצית מונסניט.jpeg",
    label: "מואסניט",
    href: "/collection/moissanite",
  },
].map((c) => ({ ...c, image: encodeURI(c.image) }));

/**
 * Inspiration gallery (ההשראה שלכן).
 * Gapless grid of category tiles — five collection photos, each labelled and
 * linked to its category. Five fit one row on desktop without distortion.
 */
export default function InstagramFeed() {
  return (
    <section className="w-full py-16 lg:py-24">
      {/* Header */}
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          הקולקציות שלנו
        </h2>
        <p className="mt-3 text-sm font-light tracking-wide text-ash">
          קנו לפי קטגוריה
        </p>
      </div>

      {/* Gapless category grid — 5 across on desktop */}
      <div className="grid grid-cols-2 gap-0 sm:grid-cols-3 md:grid-cols-5">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.href}
            href={cat.href}
            aria-label={`קטגוריית ${cat.label}`}
            className={`group relative aspect-square overflow-hidden bg-pearl ${
              i === CATEGORIES.length - 1 ? "max-sm:col-span-2" : ""
            }`}
          >
            <Image
              src={cat.image}
              alt={`קטגוריית ${cat.label} — Oridor`}
              fill
              sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover object-center transition-transform duration-700 ease-cinematic group-hover:scale-105"
            />
            {/* Gradient + category label */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
            <span className="absolute inset-x-0 bottom-5 text-center text-base font-light tracking-wide text-white transition-colors duration-300 group-hover:text-gold">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
