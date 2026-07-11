"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import PriceTag from "./PriceTag";

export interface NewArrival {
  id: string;
  name: string;
  price: number;
  compare_at_price?: number;
  material: string;
  image_url: string;
  slug: string;
}


/**
 * New Arrivals grid — a strict, uniform layout: every image is a square
 * (aspect-square + object-cover) so the grid is perfectly aligned. Subtle
 * lift + zoom on hover, quick-add-to-collection button.
 */
export default function NewArrivalsGrid({
  products,
  layout = "carousel",
}: {
  products: NewArrival[];
  /**
   * "carousel" — mobile horizontal snap-scroll (used on the homepage section).
   * "grid" — a standard vertical 2-col grid on mobile (used on collection pages
   * so every product is visible by scrolling down).
   */
  layout?: "carousel" | "grid";
}) {
  const { addByHandle } = useCart();

  const quickAdd = (e: React.MouseEvent, p: NewArrival) => {
    e.preventDefault();
    e.stopPropagation();
    addByHandle(p.slug);
  };

  const containerClass =
    layout === "grid"
      ? "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14"
      : "hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 sm:-mx-10 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:px-0";
  // Seamless card — gentle lift on hover; no tap-highlight flash on touch.
  const hoverClass =
    "bg-transparent transition-transform duration-300 ease-out [-webkit-tap-highlight-color:transparent] md:hover:-translate-y-1";
  const itemClass =
    layout === "grid"
      ? `group block ${hoverClass}`
      : `group block w-[62%] flex-shrink-0 snap-start sm:w-[42%] lg:w-auto ${hoverClass}`;

  return (
    <div className={containerClass}>
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/collections/new/${p.slug}`}
          className={itemClass}
        >
          {/* Flat, transparent card — the product image sits directly on the
              page background with no box, border, or shadow. */}
          <div
            className={`relative aspect-[4/5] w-full overflow-hidden bg-transparent`}
          >
            <Image
              src={encodeURI(p.image_url)}
              alt={`${p.name} — ${p.material}`}
              fill
              sizes="(min-width: 1024px) 25vw, 62vw"
              className="object-contain object-center p-4 [filter:drop-shadow(0px_4px_8px_rgba(0,0,0,0.08))] transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Minimalist quick-add — a subtle outline chip that fades in on hover */}
            <button
              type="button"
              onClick={(e) => quickAdd(e, p)}
              aria-label={`הוספת ${p.name} לאוסף`}
              className="absolute inset-x-4 bottom-4 flex translate-y-2 items-center justify-center gap-2 border border-charcoal/15 bg-canvas/85 py-2.5 text-[11px] tracking-[0.15em] text-charcoal opacity-0 backdrop-blur-sm transition-all duration-300 ease-cinematic group-hover:translate-y-0 group-hover:opacity-100 hover:border-charcoal/40"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              הוספה לאוסף
            </button>
          </div>

          <div className="px-2 pt-6 text-center">
            <h3 className="text-xs font-normal leading-relaxed tracking-[0.08em] text-charcoal transition-colors duration-300 group-hover:text-gold sm:text-[13px]">
              {p.name}
            </h3>
            <PriceTag price={p.price} compareAt={p.compare_at_price} className="mt-2" />
          </div>
        </Link>
      ))}
    </div>
  );
}
