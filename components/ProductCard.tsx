"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import PriceTag from "./PriceTag";
import { gridImageClass } from "@/lib/gridImage";
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
  /** Product category — drives category-aware image framing (e.g. zoom necklaces). */
  category?: string | null;
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
  compareAt,
  handle,
  href = "#",
  fit = "cover",
  category,
  variants,
  secondaryImage,
}: ProductCardProps) {
  const { addByHandle, openCart } = useCart();

  // Multi-colour pieces let the shopper preview each finish in place.
  const hasSwatches = !!variants && variants.length > 1;
  const [activeColor, setActiveColor] = useState(0);
  const displayImage = hasSwatches ? variants![activeColor].image : image;

  // Hover image — mapped PER-PRODUCT: the product's own dedicated hover file
  // (secondaryImage) if it has one, otherwise its second colour/finish. When a
  // product has neither, hoverImage is undefined → no hover, so a card defaults
  // to its primary image and never shows a generic/incorrect shot.
  const hoverImage =
    secondaryImage ??
    (variants && variants.length > 1 ? variants[1].image : undefined);
  // Dedicated hover files are full-bleed lifestyle shots (cover); a second
  // finish is a studio product shot (contain, matching the primary framing).
  const hoverIsCover = fit === "cover";

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
      className="group flex h-full flex-col bg-transparent transition-[transform,opacity] duration-300 ease-out [-webkit-tap-highlight-color:transparent] active:opacity-90 md:hover:-translate-y-1"
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
          className={gridImageClass(category)}
        />

        {/* Hover cross-fade to the product's OWN second image (second finish).
            Only rendered when a genuine second image exists, and only while the
            shopper hasn't picked a specific colour — so it never shows a wrong
            or generic item. */}
        {hoverImage && activeColor === 0 && (
          <Image
            src={hoverImage}
            alt={`${title} — תמונה נוספת`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`${hoverIsCover ? "object-cover object-center" : gridImageClass(category)} opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-active:opacity-100`}
          />
        )}

        {/* Minimal status tag — top-right (inline-start in RTL) */}
        {tag && (
          <span className="pointer-events-none absolute start-3 top-3 z-10 border border-charcoal/25 bg-canvas/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-charcoal backdrop-blur-sm">
            {tag}
          </span>
        )}

        {/* Quick Add — hover-reveal over the bottom of the image (desktop only) */}
        {/* Quick-add is only clickable/hoverable once actually visible. An
            opacity-0 element still receives pointer events, so an unconditional
            pointer-events-auto let the invisible button hold :hover — leaving
            the card looking "stuck" — and even accept phantom clicks. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden p-4 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 sm:block">
          <button
            type="button"
            onClick={handleAdd}
            aria-label={quickAddLabel}
            className="btn-primary w-full pointer-events-none group-hover:pointer-events-auto"
          >
            הוספה מהירה
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-2 pt-6 text-center">
        <h3 className="w-full text-xs font-normal leading-relaxed tracking-[0.08em] text-charcoal transition-colors duration-300 group-hover:text-gold sm:text-[13px]">
          {title}
        </h3>

        {/* Bottom group — swatches, price and CTA anchored to the card bottom
            (flex space-between effect via mt-auto), so every card lines up
            regardless of the title/content above. */}
        <div className="mt-auto flex w-full flex-col items-center pt-4">
          {/* Fixed-height swatch slot — always reserves one 44px row, even when
              a product has no swatches, so the price below stays aligned. */}
          <div className="flex h-11 items-center justify-center gap-0.5">
            {hasSwatches &&
              variants!.map((v, i) => {
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

          <PriceTag price={price} compareAt={compareAt} className="mt-1" />

          {/* Quick Add — visible beneath the price on mobile */}
          <button
            type="button"
            onClick={handleAdd}
            aria-label={quickAddLabel}
            className="btn-primary mt-3 w-full sm:hidden"
          >
            הוספה מהירה
          </button>
        </div>
      </div>
    </Link>
  );
}
