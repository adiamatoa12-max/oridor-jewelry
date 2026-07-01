"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import products from "@/data/moissanite_collection.json";
import { type MoissaniteProduct } from "./MoissaniteGrid";
import { useCart } from "./CartContext";

// Top sellers — chosen across categories so the jewelry leads.
const TOP_IDS = [
  "matan-16",
  "matan-11",
  "matan-24",
  "matan-1",
  "matan-8",
  "matan-22",
];

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * "הנמכרים ביותר" — a compact, horizontally swipeable carousel of top products
 * on a clean light background. Snap scrolling on touch; arrow controls on desktop.
 */
export default function Bestsellers() {
  const scroller = useRef<HTMLDivElement>(null);
  const { addItem, openCart } = useCart();
  const all = products as MoissaniteProduct[];

  const quickAdd = (e: React.MouseEvent, p: MoissaniteProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: p.id, title: p.name, price: p.price, image: encodeURI(p.image_url) });
    openCart();
  };
  const top = TOP_IDS.map((id) => all.find((p) => p.id === id)).filter(
    Boolean,
  ) as MoissaniteProduct[];

  // dir: +1 = next (later items), -1 = previous. In RTL the content extends to
  // the left, so advancing means a negative scrollLeft delta.
  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: -dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mb-10 flex items-end justify-between">
        <div className="text-center sm:text-start">
          <p className="mb-3 text-xs tracking-[0.25em] text-gold">המבוקשים שלנו</p>
          <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
            הנמכרים ביותר
          </h2>
        </div>

        {/* Desktop arrow controls */}
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label="הקודם"
            onClick={() => scrollBy(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-platinum/70 text-charcoal transition-colors hover:border-gold hover:text-gold"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="הבא"
            onClick={() => scrollBy(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-platinum/70 text-charcoal transition-colors hover:border-gold hover:text-gold"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="hide-scrollbar -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-2 px-2 lg:gap-6"
      >
        {top.map((p) => (
          <Link
            key={p.id}
            href={`/collection/moissanite/${p.slug}`}
            className="group w-[42vw] max-w-[230px] flex-none snap-start sm:w-[30vw] lg:w-[22%]"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-[#F8F8F8]">
              <Image
                src={encodeURI(p.image_url)}
                alt={p.name}
                fill
                sizes="(min-width: 1024px) 22vw, 42vw"
                className="object-cover object-center transition-transform duration-700 ease-cinematic group-hover:scale-105"
              />
              {/* Quick add-to-cart — slides up on hover */}
              <button
                type="button"
                onClick={(e) => quickAdd(e, p)}
                aria-label={`הוספת ${p.name} לסל`}
                className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 rounded-sm bg-canvas/90 py-2.5 text-[11px] tracking-[0.15em] text-charcoal opacity-0 backdrop-blur-sm transition-all duration-300 ease-cinematic group-hover:translate-y-0 group-hover:opacity-100 hover:bg-charcoal hover:text-canvas"
              >
                <ShoppingBag size={14} strokeWidth={1.5} />
                הוספה לסל
              </button>
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-sm font-normal tracking-wide text-charcoal">
                {p.name}
              </h3>
              <p className="mt-1 text-sm font-light text-graphite">
                {formatPrice(p.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/collection/moissanite" className="btn-ghost">
          לכל הקולקציה
        </Link>
      </div>
    </section>
  );
}
