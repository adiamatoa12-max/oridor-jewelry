"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface Variant {
  color: string;
  hex: string;
  image_url: string;
}
export interface VariantProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  material: string;
  slug: string;
  variants: Variant[];
}

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * Product card with interactive color swatches. Clicking a swatch instantly
 * swaps the displayed image to that color variant — a clean, minimalist take
 * on a high-end variation selector.
 */
export default function VariantCard({ product }: { product: VariantProduct }) {
  const [active, setActive] = useState(0);
  const variant = product.variants[active];

  return (
    <div className="group block">
      <Link
        href={`/collection/signature/${product.slug}`}
        className="block overflow-hidden rounded-md border border-platinum/40 bg-canvas shadow-card transition-all duration-500 ease-cinematic hover:-translate-y-1 hover:shadow-cardHover"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#F8F8F8]">
          {/* Crossfade between variant images */}
          {product.variants.map((v, i) => (
            <Image
              key={v.image_url}
              src={encodeURI(v.image_url)}
              alt={`${product.name} — ${v.color}`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className={`object-contain object-center p-4 transition-opacity duration-500 ease-cinematic ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </Link>

      <div className="px-1 py-4 text-center">
        <h3 className="text-[13px] font-normal leading-snug tracking-wide text-charcoal sm:text-sm md:text-base">{product.name}</h3>
        <p className="mt-1 text-[13px] font-light text-graphite sm:text-sm md:text-base">{formatPrice(product.price)}</p>

        {/* Color swatches — 20px dots inside a 44px tap target for touch */}
        <div className="mt-1 flex items-center justify-center gap-1">
          {product.variants.map((v, i) => {
            const on = i === active;
            return (
              <button
                key={v.color}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`צבע ${v.color}`}
                aria-pressed={on}
                title={v.color}
                className="inline-flex h-11 w-11 items-center justify-center"
              >
                <span
                  className={`h-5 w-5 rounded-full border transition-all duration-200 ${
                    on
                      ? "scale-110 border-charcoal ring-1 ring-charcoal/30 ring-offset-1"
                      : "border-platinum/70"
                  }`}
                  style={{ backgroundColor: v.hex }}
                />
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] font-light tracking-wide text-ash">{variant.color}</p>
      </div>
    </div>
  );
}
