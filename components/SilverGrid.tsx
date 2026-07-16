"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import PriceTag from "./PriceTag";
import { gridImageClass } from "@/lib/gridImage";

export interface SilverColorVariant {
  color: string;
  hex: string;
  image_url: string;
}

export interface SilverProduct {
  id: string;
  name: string;
  price: number;
  compare_at_price?: number;
  material: string;
  image_url: string;
  slug: string;
  category?: string;
  /** Colour/metal variants — renders swatches and swaps the image when >1. */
  variants?: SilverColorVariant[];
}


/**
 * Silver collection grid ("קולקציית כסף").
 * One card per unique style; multi-metal pieces expose colour swatches that
 * swap the displayed image in place instead of cluttering the grid with dupes.
 */
export default function SilverGrid({ products }: { products: SilverProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-20">
      {products.map((p) => (
        <SilverCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function SilverCard({ product: p }: { product: SilverProduct }) {
  const { addByHandle } = useCart();
  const hasSwatches = !!p.variants && p.variants.length > 1;
  const [active, setActive] = useState(0);
  const displayImage = hasSwatches ? p.variants![active].image_url : p.image_url;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addByHandle(p.slug);
  };

  return (
    <Link
      href={`/collections/silver/${p.slug}`}
      className="group flex h-full flex-col bg-transparent transition-transform duration-300 ease-in-out [-webkit-tap-highlight-color:transparent] md:hover:-translate-y-1"
    >
      {/* Image floats on the page — no box, border, badge or fill; only a soft
          contact shadow. Gently scales on hover. */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-transparent">
        <Image
          src={encodeURI(displayImage)}
          alt={`${p.name} — ${p.material}`}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className={gridImageClass(p.category)}
        />
      </div>

      <div className="flex flex-1 flex-col items-center pt-6 text-center">
        <h3 className="min-h-[2.6rem] w-full text-[11px] font-light leading-relaxed tracking-[0.12em] text-charcoal transition-colors duration-300 ease-in-out group-hover:text-gold sm:text-xs">
          {p.name}
        </h3>
        <PriceTag price={p.price} compareAt={p.compare_at_price} className="mt-2.5" />

        {/* Colour swatches — 16px dots in a 44px tap target; preview in place. */}
        {hasSwatches && (
          <div className="mt-2.5 flex items-center justify-center gap-0.5">
            {p.variants!.map((v, i) => {
              const on = i === active;
              return (
                <button
                  key={v.color}
                  type="button"
                  aria-label={`צבע ${v.color}`}
                  aria-pressed={on}
                  title={v.color}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center"
                >
                  <span
                    className={`h-4 w-4 rounded-full border transition-all duration-200 ${
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
        )}

        {/* Ghost add-to-cart — always visible for a clear affordance: a thin
            1px outline with elegant padding that softly fills on hover. */}
        <button
          type="button"
          onClick={quickAdd}
          aria-label={`הוספת ${p.name} לסל`}
          className="mt-auto inline-flex items-center justify-center border border-charcoal/30 px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-charcoal transition-colors duration-300 ease-in-out hover:border-charcoal/50 hover:bg-charcoal/[0.05] active:bg-charcoal/[0.08]"
        >
          הוספה לסל
        </button>
      </div>
    </Link>
  );
}
