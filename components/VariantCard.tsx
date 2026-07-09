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
    <div className="group block bg-transparent transition-[transform,opacity] duration-300 ease-out has-[a:active]:opacity-90 md:hover:-translate-y-1">
      <Link
        href={`/collection/signature/${product.slug}`}
        className="block [-webkit-tap-highlight-color:transparent]"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-transparent">
          {/* Crossfade between variant images */}
          {product.variants.map((v, i) => (
            <Image
              key={v.image_url}
              src={encodeURI(v.image_url)}
              alt={`${product.name} — ${v.color}`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className={`object-contain object-center p-4 mix-blend-multiply transition-opacity duration-500 ease-cinematic ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </Link>

      <div className="px-2 pt-5 text-center">
        <h3 className="text-xs font-normal leading-snug tracking-[0.06em] text-charcoal sm:text-[13px]">{product.name}</h3>
        <p className="mt-1.5 text-xs font-light tracking-[0.06em] text-graphite sm:text-[13px]">{formatPrice(product.price)}</p>

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
        <p className="mt-2 text-[11px] font-light tracking-wide text-neutral-500">{variant.color}</p>
      </div>
    </div>
  );
}
