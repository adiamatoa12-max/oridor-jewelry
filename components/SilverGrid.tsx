"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import PriceTag from "./PriceTag";

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
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
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
      href={`/collection/silver/${p.slug}`}
      className="group block bg-transparent transition-transform duration-300 ease-out [-webkit-tap-highlight-color:transparent] md:hover:-translate-y-1"
    >
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden ${
          displayImage.endsWith(".png")
            ? "bg-transparent"
            : "rounded-2xl bg-canvas shadow-card ring-1 ring-charcoal/[0.05]"
        }`}
      >
        <Image
          src={encodeURI(displayImage)}
          alt={`${p.name} — ${p.material}`}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-contain object-center p-4 [filter:drop-shadow(0px_4px_8px_rgba(0,0,0,0.08))] transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="pointer-events-none absolute start-3 top-3 border border-platinum/70 bg-canvas/70 px-2.5 py-1 text-[10px] tracking-[0.2em] text-graphite backdrop-blur-sm">
          כסף 925
        </span>

        {/* Quick add-to-collection — slides up on hover */}
        <button
          type="button"
          onClick={quickAdd}
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

        {/* Colour swatches — 16px dots in a 44px tap target; preview in place. */}
        {hasSwatches && (
          <div className="mt-2 flex items-center justify-center gap-0.5">
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
      </div>
    </Link>
  );
}
