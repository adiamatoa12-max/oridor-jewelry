"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
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
export default function SignatureSets() {
  const [active, setActive] = useState<SignatureSet | null>(null);
  const { addItem, openCart } = useCart();

  const addSet = (set: SignatureSet) => {
    set.pieces.forEach((p) =>
      addItem({ id: p.id, title: p.name, price: p.price, image: encodeURI(p.image) }),
    );
    setActive(null);
    openCart();
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mb-14 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">מוכנים לעטות</p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          סטים מומלצים
        </h2>
      </div>

      {/* Swipeable horizontal carousel — scroll-snaps each card into view.
          Scrollbar hidden for a clean look; negative margins let cards bleed to
          the section edge on mobile so a peek of the next card invites swiping. */}
      <div className="hide-scrollbar -mx-6 flex snap-x snap-mandatory flex-nowrap gap-6 overflow-x-auto px-6 pb-2 sm:-mx-10 sm:px-10 sm:gap-8 lg:-mx-16 lg:px-16 lg:gap-10">
        {SETS.map((set) => (
          <button
            key={set.id}
            type="button"
            onClick={() => setActive(set)}
            className="group block w-[85vw] flex-shrink-0 snap-center overflow-hidden rounded-sm bg-white text-start shadow-card transition-shadow duration-300 hover:shadow-cardHover sm:w-[45vw] md:w-[350px]"
            aria-label={`צפייה בפריטי ${set.title}`}
          >
            {/* Clean image on top — a strict, uniform aspect ratio with
                object-cover forces every set photo to identical dimensions, so
                no card is smaller or cropped inconsistently. */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F0]">
              <Image
                src={encodeURI(set.image)}
                alt={set.title}
                fill
                sizes="(min-width: 768px) 350px, 85vw"
                className="h-full w-full object-cover object-center transition-transform duration-[1200ms] ease-cinematic group-hover:scale-[1.03]"
              />
            </div>

            {/* Readable text block — solid white, deep dark type, sits neatly
                below the image for a clean, modern e-commerce card. */}
            <div className="bg-white p-5 text-center sm:p-6">
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
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
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
