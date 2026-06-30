import Image from "next/image";
import Link from "next/link";

interface JewelrySet {
  id: string;
  name: string;
  detail: string;
  price: number;
  image: string;
  href: string;
}

// Curated sets. Local collection photos (Hebrew filenames percent-encoded).
const SETS: JewelrySet[] = [
  {
    id: "set-signature",
    name: "סט הסיגנצ׳ר",
    detail: "שרשרת · צמיד · עגילים",
    price: 1490,
    image: "/photo/קולקצית מונסניט.jpeg",
    href: "/collection/moissanite",
  },
  {
    id: "set-evening",
    name: "סט הערב",
    detail: "שרשרת תליון · עגילים תואמים",
    price: 890,
    image: "/photo/קולקצית.jpeg",
    href: "/collection/moissanite",
  },
  {
    id: "set-everyday",
    name: "סט היומיום",
    detail: "צמיד טניס · צמיד עדין",
    price: 760,
    image: "/photo/קולקצית 5.jpeg",
    href: "/collection/moissanite",
  },
  {
    id: "set-bridal",
    name: "סט הכלה",
    detail: "טבעת סוליטר · טבעת פאווה",
    price: 1290,
    image: "/photo/קוליקצת 2.jpeg",
    href: "/collection/moissanite",
  },
  {
    id: "set-studs",
    name: "סט הניצוץ",
    detail: "עגילים צמודים · שרשרת",
    price: 980,
    image: "/photo/קולקצית 6.jpeg",
    href: "/collection/moissanite",
  },
].map((s) => ({ ...s, image: encodeURI(s.image) }));

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * "Perfect Sets" — a sleek horizontal carousel of curated jewelry sets.
 * Glassmorphism cards (translucent + blurred), each with a "shop the set" CTA.
 */
export default function PerfectSets() {
  return (
    <section className="py-28 lg:py-40">
      {/* Header */}
      <div className="mb-12 px-6 text-center sm:px-10 lg:px-16">
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          סטים מושלמים
        </h2>
        <p className="mt-3 text-sm font-light text-graphite">
          קומבינציות שנבחרו בקפידה ליצירת מראה הרמוני ומדויק
        </p>
      </div>

      {/* Carousel */}
      <div className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 sm:px-10 lg:gap-8 lg:px-16">
        {SETS.map((set) => (
          <Link
            key={set.id}
            href={set.href}
            className="group w-64 shrink-0 snap-start overflow-hidden rounded-md border border-white/50 bg-white/50 shadow-card ring-1 ring-platinum/30 backdrop-blur-md transition-all duration-500 ease-cinematic hover:-translate-y-1 hover:shadow-cardHover md:w-80"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F8F8F8]">
              <Image
                src={set.image}
                alt={`${set.name} — סט תכשיטים מבית Oridor`}
                fill
                sizes="(min-width: 768px) 20rem, 16rem"
                className="object-cover object-center transition-transform duration-700 ease-cinematic group-hover:scale-105"
              />
              <span className="pointer-events-none absolute start-3 top-3 border border-gold/60 bg-canvas/60 px-2.5 py-1 text-[10px] tracking-[0.2em] text-gold backdrop-blur-sm">
                סט
              </span>
            </div>

            <div className="px-5 py-5 text-center">
              <h3 className="text-sm font-normal tracking-wide text-charcoal">
                {set.name}
              </h3>
              <p className="mt-1 text-xs font-light text-ash">{set.detail}</p>
              <p className="mt-2 text-sm font-light text-graphite">
                {formatPrice(set.price)}
              </p>
              <span className="mt-4 inline-block border border-charcoal/40 px-8 py-2.5 text-[11px] uppercase tracking-[0.25em] text-charcoal transition-all duration-500 ease-cinematic group-hover:border-gold group-hover:text-gold">
                לרכישת הסט
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
