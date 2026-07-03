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
    // Mobile: a sleek horizontal snap-carousel showing ~1.6 items (hinting more
    // to scroll). Desktop: a clean, flush 4-column editorial row.
    <div className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 sm:-mx-10 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:px-0">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/collection/new/${p.slug}`}
          className="group block w-[62%] flex-shrink-0 snap-start sm:w-[42%] lg:w-auto"
        >
          {/* Flush image — no card, no shadow, no border. Just the jewelry. */}
          <div className="relative aspect-square w-full overflow-hidden bg-transparent">
            <Image
              src={encodeURI(p.image_url)}
              alt={`${p.name} — ${p.material}`}
              fill
              sizes="(min-width: 1024px) 25vw, 62vw"
              className="object-cover object-center mix-blend-multiply transition-transform duration-700 ease-cinematic group-hover:scale-[1.03]"
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

          <div className="px-2 pt-4 text-center">
            <h3 className="text-[13px] font-light leading-snug tracking-wide text-charcoal sm:text-sm md:text-base">
              {p.name}
            </h3>
            <p className="mt-2 text-[13px] font-light text-neutral-600 sm:text-sm">
              {formatPrice(p.price)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
