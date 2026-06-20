import Image from "next/image";
import Link from "next/link";

interface Category {
  name: string;
  href: string;
  image: string;
}

const CATEGORIES: Category[] = [
  {
    name: "שרשראות",
    href: "/necklaces",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "צמידים",
    href: "/bracelets",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "עגילים",
    href: "/earrings",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "טבעות",
    href: "/rings",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "כלות",
    href: "/bridal",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "קולקציה חדשה",
    href: "/new-arrivals",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=500&q=80",
  },
];

/**
 * Editorial category navigation.
 * Desktop: 6-column grid, no gaps, hairline dividers between blocks.
 * Mobile: horizontal scroll-snap row of the same blocks.
 */
export default function CategoryShowcase() {
  return (
    <section className="w-full border-b border-gray-200">
      <div className="flex snap-x snap-mandatory overflow-x-auto md:grid md:grid-cols-6 md:overflow-visible">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative h-64 min-w-[58%] flex-none snap-start overflow-hidden rounded-sm border-r border-gray-200 bg-gray-50 last:border-r-0 sm:min-w-[40%] md:min-w-0"
          >
            {/* Full-bleed image */}
            <Image
              src={cat.image}
              alt={`קטגוריית ${cat.name} — תכשיטי כסף Oridor`}
              fill
              sizes="(min-width: 768px) 17vw, 58vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
            />

            {/* Bottom-to-top dark gradient (brand charcoal, not pure black) */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />

            {/* Category name — bottom-right, above the overlay */}
            <span className="absolute bottom-4 start-4 z-10 text-sm font-medium tracking-wide text-canvas">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
