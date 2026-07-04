"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export interface SilverColorVariant {
  color: string;
  hex: string;
  image_url: string;
}

export interface SilverProduct {
  id: string;
  name: string;
  price: number;
  material: string;
  image_url: string;
  slug: string;
  /** Colour/metal variants — renders swatches and swaps the image when >1. */
  variants?: SilverColorVariant[];
}

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * Silver collection grid ("קולקציית כסף").
 * One card per unique style; multi-metal pieces expose colour swatches that
 * swap the displayed image in place instead of cluttering the grid with dupes.
 */
export default function SilverGrid({ products }: { products: SilverProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
      {products.map((p) => (
        <SilverCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function SilverCard({ product: p }: { product: SilverProduct }) {
  const { addItem, openCart } = useCart();
  const hasSwatches = !!p.variants && p.variants.length > 1;
  const [active, setActive] = useState(0);
  const displayImage = hasSwatches ? p.variants![active].image_url : p.image_url;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: p.id,
      title: p.name,
      price: p.price,
      image: encodeURI(displayImage),
    });
    openCart();
  };

  return (
    <Link
      href={`/collection/silver/${p.slug}`}
      className="group block overflow-hidden rounded-lg bg-[#1a1a1c] shadow-xl shadow-black/25 transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#f3f2ef]">
        <Image
          src={encodeURI(displayImage)}
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
          onClick={quickAdd}
          aria-label={`הוספת ${p.name} לאוסף`}
          className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 rounded-sm bg-canvas/90 py-2.5 text-[11px] tracking-[0.15em] text-charcoal opacity-0 backdrop-blur-sm transition-all duration-300 ease-cinematic group-hover:translate-y-0 group-hover:opacity-100 hover:bg-charcoal hover:text-canvas"
        >
          <ShoppingBag size={14} strokeWidth={1.5} />
          הוספה לאוסף
        </button>
      </div>

      <div className="px-4 pb-5 pt-4 text-center">
        <h3 className="text-[13px] font-normal leading-snug tracking-wide text-white sm:text-sm md:text-base">
          {p.name}
        </h3>
        <p className="mt-2 text-[13px] font-light text-neutral-400 sm:text-sm md:text-base">
          {formatPrice(p.price)}
        </p>

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
                        ? "scale-110 border-white ring-1 ring-white/40 ring-offset-1 ring-offset-[#1a1a1c]"
                        : "border-white/40"
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
