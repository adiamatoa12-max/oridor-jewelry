"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export interface MoissaniteProduct {
  id: string;
  name: string;
  price: number;
  carat: number;
  material: string;
  image_url: string;
  slug: string;
  /** Category key for filtering (Rings/Bracelets/Necklaces/Earrings). */
  category?: string;
}

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * Moissanite collection grid.
 * Responsive glassmorphism cards (translucent + blurred) with strictly framed
 * portrait images. Links through to each product's detail page.
 */
export default function MoissaniteGrid({
  products,
}: {
  products: MoissaniteProduct[];
}) {
  const { addItem, openCart } = useCart();

  const quickAdd = (e: React.MouseEvent, p: MoissaniteProduct) => {
    // Inside a <Link>; don't navigate — just add to the cart and open it.
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: p.id, title: p.name, price: p.price, image: encodeURI(p.image_url) });
    openCart();
  };

  // Safety: render each product exactly once, even if the source list contains
  // accidental duplicates (deduped by unique slug).
  const seen = new Set<string>();
  const uniqueProducts = products.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
      {uniqueProducts.map((p) => (
        <Link
          key={p.id}
          href={`/collection/moissanite/${p.slug}`}
          className="group block overflow-hidden rounded-md border border-white/50 bg-white/50 shadow-card ring-1 ring-platinum/30 backdrop-blur-md transition-all duration-500 ease-cinematic hover:-translate-y-1 hover:shadow-cardHover"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F8F8F8]">
            <Image
              src={encodeURI(p.image_url)}
              alt={`${p.name} — ${p.material}`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover object-center transition-transform duration-700 ease-cinematic group-hover:scale-105"
            />
            <span className="pointer-events-none absolute start-3 top-3 border border-gold/60 bg-canvas/60 px-2.5 py-1 text-[10px] tracking-[0.2em] text-gold backdrop-blur-sm">
              מואסניט
            </span>

            {/* Quick add-to-cart — slides up on hover */}
            <button
              type="button"
              onClick={(e) => quickAdd(e, p)}
              aria-label={`הוספת ${p.name} לאוסף`}
              className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 rounded-sm bg-canvas/90 py-2.5 text-[11px] tracking-[0.15em] text-charcoal opacity-0 backdrop-blur-sm transition-all duration-300 ease-cinematic group-hover:translate-y-0 group-hover:opacity-100 hover:bg-charcoal hover:text-canvas"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              הוספה לאוסף
            </button>
          </div>

          <div className="px-4 py-5 text-center">
            <h3 className="text-sm font-normal tracking-wide text-charcoal">{p.name}</h3>
            <p className="mt-1 text-xs font-light text-ash">
              {p.carat} קראט · {p.material}
            </p>
            <p className="mt-2 text-sm font-light text-graphite">{formatPrice(p.price)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
