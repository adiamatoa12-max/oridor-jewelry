"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export interface SilverProduct {
  id: string;
  name: string;
  price: number;
  material: string;
  image_url: string;
  slug: string;
}

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * Silver collection grid ("קולקציית כסף").
 * A clean, distinct card treatment — pure white cards with a silver hairline
 * and a "כסף 925" tag — deliberately separate from the Moissanite grid.
 */
export default function SilverGrid({ products }: { products: SilverProduct[] }) {
  const { addItem, openCart } = useCart();

  const quickAdd = (e: React.MouseEvent, p: SilverProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: p.id, title: p.name, price: p.price, image: encodeURI(p.image_url) });
    openCart();
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/collection/silver/${p.slug}`}
          className="group block overflow-hidden rounded-md border border-platinum/40 bg-canvas shadow-card transition-all duration-500 ease-cinematic hover:-translate-y-1 hover:shadow-cardHover"
        >
          <div className="relative aspect-square w-full overflow-hidden bg-transparent">
            <Image
              src={encodeURI(p.image_url)}
              alt={`${p.name} — ${p.material}`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-contain object-center p-3 mix-blend-multiply"
            />
            <span className="pointer-events-none absolute start-3 top-3 border border-platinum/70 bg-canvas/70 px-2.5 py-1 text-[10px] tracking-[0.2em] text-graphite backdrop-blur-sm">
              כסף 925
            </span>

            {/* Quick add-to-collection — slides up on hover */}
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
            <h3 className="text-[13px] font-normal leading-snug tracking-wide text-charcoal sm:text-sm md:text-base">{p.name}</h3>
            <p className="mt-1 text-xs font-light text-ash">{p.material}</p>
            <p className="mt-2 text-[13px] font-light text-graphite sm:text-sm md:text-base">{formatPrice(p.price)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
