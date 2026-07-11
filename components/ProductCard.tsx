"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import PriceTag from "./PriceTag";
import type { ProductColorVariant } from "@/lib/catalog";

export interface ProductCardProps {
  /** Product image — expects a clean white-background product shot. */
  image: string;
  /** Optional on-model/lifestyle shot that cross-fades in on hover/touch. */
  secondaryImage?: string;
  /** Optional minimal status tag, e.g. "BEST SELLER", "LIMITED EDITION". */
  tag?: string;
  title: string;
  /** Numeric price; formatted as currency unless `priceLabel` is given. */
  price: number;
  /** Optional pre-formatted price string (overrides `price` formatting). */
  priceLabel?: string;
  /** Regular price for the launch strikethrough (optional). */
  compareAt?: number;
  /** Shopify handle — enables the quick-add button to add the real variant. */
  handle?: string;
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
  secondaryImage,
  tag,
  title,
  price,
  priceLabel,
  compareAt,
  handle,
  href = "#",
  fit = "cover",
  variants,
}: ProductCardProps) {
  const { addByHandle, openCart } = useCart();

  // Multi-colour pieces let the shopper preview each finish in place.
  const hasSwatches = !!variants && variants.length > 1;
  const [activeColor, setActiveColor] = useState(0);
  const displayImage = hasSwatches ? variants![activeColor].image : image;

  // Quick-add: don't navigate the parent link — add the real Shopify variant.
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (handle) addByHandle(handle);
    else openCart();
  };

  const quickAddLabel = `הוספה מהירה — ${title}`;

  return (
    <Link
      href={href}
      className="group block bg-transparent transition-[transform,opacity] duration-300 ease-out [-webkit-tap-highlight-color:transparent] active:opacity-90 md:hover:-translate-y-1"
    >
      {/* Flat, transparent card — the product image sits directly on the page
          background with no box, border, or shadow. */}
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden bg-transparent`}
      >
        <Image
          src={displayImage}
          alt={`${title} — תכשיט כסף מבית Oridor`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain object-center p-4 [filter:drop-shadow(0px_4px_8px_rgba(0,0,0,0.08))] transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* On-model lifestyle shot — cross-fades in on hover (desktop) and
            touch-down (mobile, group-active). Full-bleed cover, no blend.
            Only shown while the shopper hasn't picked a colour swatch. */}
        {secondaryImage && activeColor === 0 && (
          <Image
            src={secondaryImage}
            alt={`${title} בעיצוב על הדוגמנית`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-active:opacity-100"
          />
        )}

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

      <div className="px-2 pt-6 text-center">
        <h3 className="text-xs font-normal leading-relaxed tracking-[0.08em] text-charcoal transition-colors duration-300 group-hover:text-gold sm:text-[13px]">
          {title}
        </h3>
        <PriceTag price={price} compareAt={compareAt} className="mt-2" />

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
