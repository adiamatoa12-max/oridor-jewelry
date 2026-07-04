"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft } from "lucide-react";
import { useCart } from "./CartContext";

interface Piece {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
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
    image: "/photo/סט 1.jpeg",
    title: "הסט המושלם לערב",
    caption: "נצנוץ דרמטי לרגעים הגדולים",
    pieces: [
      { id: "matan-16", name: "שרשרת טניס יהלומים", price: 690, image: "/photo/מתן 16.jpeg", slug: "matan-16" },
      { id: "matan-24", name: "עגילי הילה כפולה", price: 420, image: "/photo/מתן 24.jpeg", slug: "matan-24" },
      { id: "matan-11", name: "טבעת הילה עגולה", price: 490, image: "/photo/מתן 11.jpeg", slug: "matan-11" },
    ],
  },
  {
    id: "set-daily",
    image: "/photo/סט 2.jpeg",
    title: "אלגנטיות לכל יום",
    caption: "עדין, נקי ועל-זמני",
    pieces: [
      { id: "matan-18", name: "שרשרת תליון סוליטר", price: 350, image: "/photo/מתן 18.jpeg", slug: "matan-18" },
      { id: "matan-25", name: "עגילי סוליטר", price: 350, image: "/photo/מתן 25.jpeg", slug: "matan-25" },
      { id: "matan-10", name: "טבעת סוליטר עגולה", price: 410, image: "/photo/מתן 10.jpeg", slug: "matan-10" },
    ],
  },
  {
    id: "set-luxe",
    image: "/photo/סט 3.jpeg",
    title: "סט יוקרתי במיוחד",
    caption: "הצהרת סטייל ללא פשרות",
    pieces: [
      { id: "matan-17", name: "שרשרת טניס שחורה", price: 690, image: "/photo/מתן 17.jpeg", slug: "matan-17" },
      { id: "matan-14", name: "צמיד טניס יהלומים", price: 450, image: "/photo/מתן 14.jpeg", slug: "matan-14" },
      { id: "matan-22", name: "עגילי טיפה הילה", price: 380, image: "/photo/מתן 22.jpeg", slug: "matan-22" },
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
}: {
  /**
   * "carousel" — mobile horizontal snap-slider (homepage).
   * "grid" — standard vertical product grid (collection pages).
   */
  layout?: "carousel" | "grid";
}) {
  const [active, setActive] = useState<SignatureSet | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem, openCart } = useCart();

  const addSet = (set: SignatureSet) => {
    set.pieces.forEach((p) =>
      addItem({ id: p.id, title: p.name, price: p.price, image: encodeURI(p.image) }),
    );
    setActive(null);
    openCart();
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
    const child = scrollRef.current?.children[i] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
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
            {/* Refined premium structure: one large lifestyle/model image on the
                start side, two smaller product-detail shots stacked on the end.
                The product thumbnails use mix-blend-multiply so their white studio
                background melts into the page — no hard rectangles. */}
            <div className="relative flex aspect-square w-full gap-1.5 overflow-hidden md:aspect-[4/5]">
              {/* Large model image — biased to the left of the collage where the
                  model sits, so the frame shows the lifestyle shot (not one of the
                  collage's baked-in detail cells). */}
              <div className="relative h-full w-3/5 overflow-hidden bg-[#F5F5F0]">
                <Image
                  src={encodeURI(set.image)}
                  alt={set.title}
                  fill
                  sizes="(min-width: 768px) 210px, 51vw"
                  className="h-full w-full object-cover object-left transition-transform duration-[1200ms] ease-cinematic group-hover:scale-[1.03]"
                />
              </div>

              {/* Two stacked product-detail thumbnails */}
              <div className="grid h-full w-2/5 grid-rows-2 gap-1.5">
                {set.pieces.slice(0, 2).map((pc) => (
                  <div
                    key={pc.id}
                    className="relative h-full w-full overflow-hidden bg-transparent"
                  >
                    <Image
                      src={encodeURI(pc.image)}
                      alt={`${set.title} — ${pc.name}`}
                      fill
                      sizes="(min-width: 768px) 140px, 34vw"
                      className="h-full w-full object-cover object-center mix-blend-multiply transition-transform duration-[1200ms] ease-cinematic group-hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Text block — flush with the page, deep dark title, muted caption. */}
            <div className="px-1 pt-4 text-center">
              <h3 className="text-lg font-normal tracking-wide text-neutral-900">
                {set.title}
              </h3>
              <p className="mt-1.5 text-sm font-light tracking-wide text-neutral-500">
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
            className="animate-soft-float text-stone-500 motion-reduce:animate-none"
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
                  i === activeSlide ? "w-5 bg-stone-700" : "w-1.5 bg-stone-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Set detail modal */}
      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
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
                    href={`/collection/moissanite/${p.slug}`}
                    className="group flex items-center gap-4"
                    onClick={() => setActive(null)}
                  >
                    <div className="relative h-16 w-16 flex-none overflow-hidden rounded-sm bg-[#F8F8F8]">
                      <Image
                        src={encodeURI(p.image)}
                        alt={p.name}
                        fill
                        sizes="64px"
                        className="object-cover object-center mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-normal text-charcoal transition-colors group-hover:text-gold">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-xs font-light text-graphite">
                        {formatPrice(p.price)}
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
              {formatPrice(active.pieces.reduce((s, p) => s + p.price, 0))}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
