"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { useCart } from "./CartContext";
import type { VariantProduct } from "./VariantCard";

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * Product detail view with a large image and interactive color swatches.
 * Selecting a swatch dynamically switches the hero image and the variant that
 * gets added to the cart.
 */
export default function VariantProductView({ product }: { product: VariantProduct }) {
  const { addItem, openCart } = useCart();
  const [active, setActive] = useState(0);
  const variant = product.variants[active];

  const addToCart = () => {
    addItem({
      id: `${product.id}-${variant.color}`,
      title: product.name,
      variant: variant.color,
      price: product.price,
      image: encodeURI(variant.image_url),
    });
    openCart();
  };

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-20">
      {/* Image with variant crossfade */}
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-platinum/40">
        {product.variants.map((v, i) => (
          <Image
            key={v.image_url}
            src={encodeURI(v.image_url)}
            alt={`${product.name} — ${v.color}`}
            fill
            priority={i === 0}
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`object-contain object-center p-6 transition-opacity duration-500 ease-cinematic ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">קולקציית החתימה</p>
        <h1 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal lg:text-4xl">
          {product.name}
        </h1>
        <p className="mt-4 text-xl font-light text-graphite">{formatPrice(product.price)}</p>

        <span className="my-8 block h-px w-16 bg-gold" />

        {/* Color selector */}
        <div>
          <p className="mb-3 text-xs tracking-[0.2em] text-ash">
            צבע: <span className="text-charcoal">{variant.color}</span>
          </p>
          <div className="flex items-center gap-3">
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
                  className={`h-8 w-8 rounded-full border transition-all duration-200 ${
                    on
                      ? "scale-110 border-charcoal ring-1 ring-charcoal/30 ring-offset-2"
                      : "border-platinum/70 hover:scale-105"
                  }`}
                  style={{ backgroundColor: v.hex }}
                />
              );
            })}
          </div>
        </div>

        <button type="button" onClick={addToCart} className="btn-primary mt-10 w-full sm:w-auto sm:px-16">
          הוספה לאוסף
        </button>

        <div className="mt-6 flex items-center gap-1.5 text-xs font-light tracking-wide text-graphite">
          <ShieldCheck size={14} strokeWidth={1.5} className="text-gold" />
          {product.material} · עבודת יד · אחריות מלאה
        </div>
      </div>
    </div>
  );
}
