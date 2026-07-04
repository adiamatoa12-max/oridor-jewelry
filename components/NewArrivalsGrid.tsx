"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export interface NewArrival {
  id: string;
  name: string;
  price: number;
  material: string;
  image_url: string;
  slug: string;
}

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

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
  const { addItem, openCart } = useCart();

  const quickAdd = (e: React.MouseEvent, p: NewArrival) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: p.id, title: p.name, price: p.price, image: encodeURI(p.image_url) });
    openCart();
  };

  const containerClass =
    layout === "grid"
      ? "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14"
      : "hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 sm:-mx-10 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:px-0";
  // Dark-elegance card: near-black surface, borderless, floating with a soft
  // shadow and a lift on hover.
  const hoverClass =
    "overflow-hidden rounded-lg bg-[#1a1a1c] shadow-xl shadow-black/25 transition-transform duration-300 ease-out hover:-translate-y-1";
  const itemClass =
    layout === "grid"
      ? `group block ${hoverClass}`
      : `group block w-[62%] flex-shrink-0 snap-start sm:w-[42%] lg:w-auto ${hoverClass}`;

  return (
    <div className={containerClass}>
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/collection/new/${p.slug}`}
          className={itemClass}
        >
          {/* Light image well — keeps the white-studio jewelry crisp inside the
              dark card (multiply can't blend it onto a dark surface). */}
          <div className="relative aspect-square w-full overflow-hidden bg-[#f3f2ef]">
            <Image
              src={encodeURI(p.image_url)}
              alt={`${p.name} — ${p.material}`}
              fill
              sizes="(min-width: 1024px) 25vw, 62vw"
              className="object-cover object-center mix-blend-multiply"
            />

            {/* Minimalist quick-add — a subtle outline chip that fades in on hover */}
            <button
              type="button"
              onClick={(e) => quickAdd(e, p)}
              aria-label={`הוספת ${p.name} לאוסף`}
              className="absolute inset-x-4 bottom-4 flex translate-y-2 items-center justify-center gap-2 border border-charcoal/15 bg-white/85 py-2.5 text-[11px] tracking-[0.15em] text-charcoal opacity-0 backdrop-blur-sm transition-all duration-300 ease-cinematic group-hover:translate-y-0 group-hover:opacity-100 hover:border-charcoal/40"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              הוספה לאוסף
            </button>
          </div>

          <div className="px-4 pb-5 pt-4 text-center">
            <h3 className="text-[13px] font-light leading-snug tracking-wide text-white sm:text-sm md:text-base">
              {p.name}
            </h3>
            <p className="mt-2 text-[13px] font-light text-neutral-400 sm:text-sm">
              {formatPrice(p.price)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
