"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft } from "lucide-react";
import { useCart } from "./CartContext";
import moissaniteData from "@/data/moissanite_collection.json";

// JSON prices, used only as a fallback before Shopify prices arrive.
const PRICE_BY_SLUG: Record<string, number> = Object.fromEntries(
  (moissaniteData as { slug: string; price: number }[]).map((p) => [
    p.slug,
    p.price,
  ]),
);

interface Piece {
  id: string;
  name: string;
  image: string;
  slug: string;
  /** Direct link to this piece's real product page in the store. */
  href: string;
}

interface SignatureSet {
  id: string;
  image: string;
  title: string;
  caption: string;
  pieces: Piece[];
}

const SETS: SignatureSet[] = [
  {
    id: "set-evening",
    image: "/photo/set-1.jpeg",
    title: "הסט המושלם לערב",
    caption: "נצנוץ דרמטי לרגעים הגדולים",
    pieces: [
      { id: "matan-18", name: "שרשרת תליון סוליטר", image: "/photo/moissanite-18.png", slug: "matan-18", href: "/collections/moissanite/matan-18" },
      { id: "matan-3", name: "צמיד עדין סוליטר", image: "/photo/moissanite-3.png", slug: "matan-3", href: "/collections/moissanite/matan-3" },
      { id: "matan-28", name: "עגילי סוליטר עגול", image: "/photo/moissanite-28.png", slug: "matan-28", href: "/collections/moissanite/matan-28" },
      { id: "matan-10", name: "טבעת סוליטר עגולה", image: "/photo/moissanite-10.png", slug: "matan-10", href: "/collections/moissanite/matan-10" },
    ],
  },
  {
    id: "set-daily",
    image: "/photo/set-2.jpeg",
    title: "אלגנטיות לכל יום",
    caption: "עדין, נקי ועל-זמני",
    pieces: [
      { id: "matan-20", name: "שרשרת סוליטר אובל", image: "/photo/moissanite-20.png", slug: "matan-20", href: "/collections/moissanite/matan-20" },
      { id: "matan-4", name: "צמיד טיפה", image: "/photo/moissanite-4.png", slug: "matan-4", href: "/collections/moissanite/matan-4" },
      { id: "matan-27", name: "עגילי טיפה", image: "/photo/moissanite-27.png", slug: "matan-27", href: "/collections/moissanite/matan-27" },
      { id: "matan-13", name: "טבעת טיפה סוליטר", image: "/photo/moissanite-13.png", slug: "matan-13", href: "/collections/moissanite/matan-13" },
    ],
  },
  {
    id: "set-luxe",
    image: "/photo/set-3.jpeg",
    title: "סט קלאסי לגבר",
    caption: "הצהרת סטייל ללא פשרות",
    pieces: [
      { id: "matan-17", name: "שרשרת טניס שחורה", image: "/photo/moissanite-17.png", slug: "matan-17", href: "/collections/moissanite/matan-17" },
      { id: "bracelet-1", name: "צמיד טניס אבני חן שחורות", image: "/photo/bracelet-1.png", slug: "bracelet-1", href: "/collections/moissanite/bracelet-1" },
    ],
  },
];

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * "סטים מומלצים" — three signature sets shown as an elegant row of imagery with
 * premium captions. Each acts as a button that opens a modal listing the pieces
 * that make up the set, each linking to its product page, with an add-all CTA.
 */
export default function SignatureSets({
  layout = "carousel",
  livePrices,
}: {
  /**
   * "carousel" — mobile horizontal snap-slider (homepage).
   * "grid" — standard vertical product grid (collection pages).
   */
  layout?: "carousel" | "grid";
  /** Live Shopify prices by slug; falls back to the JSON price when absent. */
  livePrices?: Record<string, number>;
}) {
  // Shopify is the source of truth; JSON is only the fallback.
  const priceFor = (slug: string) =>
    livePrices?.[slug] ?? PRICE_BY_SLUG[slug] ?? 0;
  const [active, setActive] = useState<SignatureSet | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addByHandle } = useCart();
  // Portal target only exists on the client; guard SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const addSet = (set: SignatureSet) => {
    // Add each piece's real Shopify variant (mutations are serialized).
    set.pieces.forEach((p) => addByHandle(p.slug));
    setActive(null);
  };

  const isCarousel = layout === "carousel";

  // Track which card is centred so the pagination dots stay in sync. Works in
  // RTL by measuring which child sits closest to the container's centre.
  const handleScroll = () => {
    const cont = scrollRef.current;
    if (!cont) return;
    const center = cont.getBoundingClientRect().left + cont.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(cont.children).forEach((c, i) => {
      const r = (c as HTMLElement).getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActiveSlide(best);
  };

  const goTo = (i: number) => {
    const track = scrollRef.current;
    const child = track?.children[i] as HTMLElement | undefined;
    if (!track || !child) return;
    // Centre the card in the track horizontally only — never scrollIntoView,
    // which would also scroll the page vertically to this section.
    const cr = child.getBoundingClientRect();
    const tr = track.getBoundingClientRect();
    const delta = cr.left + cr.width / 2 - (tr.left + tr.width / 2);
    track.scrollBy({ left: delta, behavior: "smooth" });
  };

  const containerClass = isCarousel
    ? "hide-scrollbar -mx-6 flex snap-x snap-mandatory flex-nowrap gap-6 overflow-x-auto px-6 pb-2 sm:-mx-10 sm:px-10 sm:gap-8 md:mx-0 md:justify-center md:overflow-visible md:px-0 lg:gap-10"
    : "grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-8 lg:gap-10";
  const cardClass = isCarousel
    ? "group block w-[85vw] flex-shrink-0 snap-center text-start sm:w-[45vw] md:w-[320px] lg:w-[350px]"
    : "group block text-start";

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mb-14 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">מוכנים לעטות</p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          סטים מומלצים
        </h2>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className={containerClass}>
        {SETS.map((set) => (
          <button
            key={set.id}
            type="button"
            onClick={() => setActive(set)}
            className={cardClass}
            aria-label={`צפייה בפריטי ${set.title}`}
          >
            {/* Single full-bleed lifestyle collage — one clean composed image per
                set (model + styled details). No product-shot thumbnails and no
                mix-blend: those baked-in studio backgrounds are inconsistent
                (white on most, BLACK on the tennis pieces), which produced hard
                white/black rectangles. A full-bleed photo has none of that. The
                container is transparent — no hardcoded background. */}
            <div className="relative aspect-square w-full overflow-hidden bg-transparent md:aspect-[4/5]">
              <Image
                src={encodeURI(set.image)}
                alt={set.title}
                fill
                sizes="(min-width: 768px) 350px, 85vw"
                className="h-full w-full object-cover object-center transition-transform duration-[1200ms] ease-cinematic group-hover:scale-[1.03]"
              />
            </div>

            {/* Text block — flush with the page, deep dark title, muted caption. */}
            <div className="px-1 pt-4 text-center">
              <h3 className="text-lg font-normal tracking-wide text-charcoal">
                {set.title}
              </h3>
              <p className="mt-1.5 text-sm font-light tracking-wide text-ash">
                {set.caption}
              </p>
              <span className="mt-3 inline-block border-b border-gold/70 pb-0.5 text-[11px] tracking-[0.2em] text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                גלי את הסט
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile swipe cues — a soft chevron hint + pagination dots. Carousel
          only, and only where the slider actually scrolls (below md). */}
      {isCarousel && (
        <div className="mt-7 flex items-center justify-center gap-3 md:hidden">
          <ChevronLeft
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="animate-soft-float text-ash motion-reduce:animate-none"
          />
          <div className="flex items-center gap-2">
            {SETS.map((set, i) => (
              <button
                key={set.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`מעבר לסט ${i + 1}`}
                aria-current={i === activeSlide}
                className={`h-1.5 rounded-full transition-all duration-300 ease-cinematic ${
                  i === activeSlide ? "w-5 bg-charcoal" : "w-1.5 bg-platinum"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Set detail modal — portalled to <body> so a transformed ancestor
          (e.g. a Reveal fade-in wrapper) can't confine its fixed positioning. */}
      {mounted && active && createPortal(
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setActive(null)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-md bg-canvas p-8 shadow-cardHover sm:p-10">
            <button
              type="button"
              aria-label="סגירה"
              onClick={() => setActive(null)}
              className="absolute end-4 top-4 inline-flex h-10 w-10 items-center justify-center text-graphite transition-colors hover:text-charcoal"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <p className="text-center text-xs tracking-[0.25em] text-gold">הסט כולל</p>
            <h3 className="mt-2 text-center text-2xl font-light tracking-widest text-charcoal">
              {active.title}
            </h3>
            <span className="mx-auto my-6 block h-px w-12 bg-gold" />

            <ul className="space-y-4">
              {active.pieces.map((p) => (
                <li key={p.id}>
                  <Link
                    href={p.href}
                    className="group flex items-center gap-4"
                    onClick={() => setActive(null)}
                  >
                    <div className="relative h-16 w-16 flex-none overflow-hidden rounded-sm bg-canvas">
                      <Image
                        src={encodeURI(p.image)}
                        alt={p.name}
                        fill
                        sizes="64px"
                        className="object-contain object-center p-1.5 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-normal text-charcoal transition-colors group-hover:text-gold">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-xs font-light text-graphite">
                        {formatPrice(priceFor(p.slug))}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => addSet(active)}
              className="btn-primary mt-8 w-full"
            >
              הוסף את כל הסט לסל ·{" "}
              {formatPrice(active.pieces.reduce((s, p) => s + priceFor(p.slug), 0))}
            </button>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
