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
export default function NewArrivalsGrid({ products }: { products: NewArrival[] }) {
  const { addItem, openCart } = useCart();

  const quickAdd = (e: React.MouseEvent, p: NewArrival) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: p.id, title: p.name, price: p.price, image: encodeURI(p.image_url) });
    openCart();
  };

  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
      {products.map((p) => (
        <Link key={p.id} href={`/collection/new/${p.slug}`} className="group block">
          <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#F8F8F8] ring-1 ring-platinum/40 transition-all duration-500 ease-cinematic group-hover:-translate-y-1 group-hover:shadow-cardHover">
            <Image
              src={encodeURI(p.image_url)}
              alt={`${p.name} — ${p.material}`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover object-center transition-transform duration-700 ease-cinematic group-hover:scale-105"
            />
            <span className="pointer-events-none absolute start-3 top-3 border border-gold/60 bg-canvas/70 px-2.5 py-1 text-[10px] tracking-[0.2em] text-gold backdrop-blur-sm">
              חדש
            </span>

            {/* Quick add — slides up on hover */}
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

          <div className="px-1 py-4 text-center">
            <h3 className="text-sm font-normal tracking-wide text-charcoal">{p.name}</h3>
            <p className="mt-1 text-sm font-light text-graphite">{formatPrice(p.price)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
