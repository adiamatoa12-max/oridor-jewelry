"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import type { ProductColorVariant } from "@/lib/catalog";

export interface ProductCardProps {
  /** Product image — expects a clean white-background product shot. */
  image: string;
  /** Optional minimal status tag, e.g. "BEST SELLER", "LIMITED EDITION". */
  tag?: string;
  title: string;
  /** Numeric price; formatted as currency unless `priceLabel` is given. */
  price: number;
  /** Optional pre-formatted price string (overrides `price` formatting). */
  priceLabel?: string;
  href?: string;
  currency?: string;
  /** Product-on-white shots look best "contain"; lifestyle crops use "cover". */
  fit?: "cover" | "contain";
  /** Colour variants — renders swatches and swaps the image when >1 present. */
  variants?: ProductColorVariant[];
}

/**
 * Reusable product card.
 * Image sits on a crisp white surface; charcoal title + price beneath.
 * Subtle cinematic lift on hover — no harsh shadows, no black.
 *
 * Quick Add: on hover (desktop) a delicate "Add to Cart" button fades in over
 * the bottom of the image; on mobile that same action is always visible beneath
 * the price.
 */
export default function ProductCard({
  image,
  tag,
  title,
  price,
  priceLabel,
  href = "#",
  currency = "USD",
  fit = "cover",
  variants,
}: ProductCardProps) {
  const { openCart } = useCart();
  const fitClass = fit === "contain" ? "object-contain p-4" : "object-cover";

  // Multi-colour pieces let the shopper preview each finish in place.
  const hasSwatches = !!variants && variants.length > 1;
  const [activeColor, setActiveColor] = useState(0);
  const displayImage = hasSwatches ? variants![activeColor].image : image;

  const formattedPrice =
    priceLabel ??
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);

  // Quick-add: don't navigate the parent link; open the cart drawer.
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openCart();
  };

  const quickAddLabel = `הוספה מהירה — ${title}`;

  return (
    <Link
      href={href}
      className="group block bg-transparent transition-[transform,opacity] duration-300 ease-out [-webkit-tap-highlight-color:transparent] active:opacity-90 md:hover:-translate-y-1"
    >
      {/* Seamless, borderless card — the white studio background is knocked out
          by mix-blend-multiply so the jewelry rests directly on the page. */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-transparent">
        <Image
          src={displayImage}
          alt={`${title} — תכשיט כסף מבית Oridor`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`${fitClass} object-center mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105`}
        />

        {/* Minimal status tag — top-right (inline-start in RTL) */}
        {tag && (
          <span className="pointer-events-none absolute start-3 top-3 z-10 border border-charcoal/25 bg-canvas/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-charcoal backdrop-blur-sm">
            {tag}
          </span>
        )}

        {/* Quick Add — hover-reveal over the bottom of the image (desktop only) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden p-4 opacity-0 transition-opacity duration-500 ease-cinematic group-hover:opacity-100 sm:block">
          <button
            type="button"
            onClick={handleAdd}
            aria-label={quickAddLabel}
            className="btn-primary pointer-events-auto w-full"
          >
            הוספה מהירה
          </button>
        </div>
      </div>

      <div className="px-2 pt-5 text-center">
        <h3 className="text-xs font-normal leading-snug tracking-[0.06em] text-charcoal sm:text-[13px]">
          {title}
        </h3>
        <p className="mt-1.5 text-xs font-light tracking-[0.06em] text-graphite sm:text-[13px]">
          {formattedPrice}
        </p>

        {/* Minimalist colour swatches — 16px dots inside a 44px tap target.
            Clicking previews the finish in place without leaving the grid. */}
        {hasSwatches && (
          <div className="mt-1 flex items-center justify-center gap-0.5">
            {variants!.map((v, i) => {
              const on = i === activeColor;
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
                    setActiveColor(i);
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

        {/* Quick Add — always visible beneath price on mobile */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={quickAddLabel}
          className="btn-primary mt-4 w-full sm:hidden"
        >
          הוספה מהירה
        </button>
      </div>
    </Link>
  );
}
