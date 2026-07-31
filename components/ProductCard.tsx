"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import PriceTag from "./PriceTag";
import MoissaniteLabel from "./MoissaniteLabel";
import SilverLabel from "./SilverLabel";
import { gridImageClass, GRID_CARD } from "@/lib/gridImage";
import CardImageCarousel, { type CardSlide } from "./CardImageCarousel";
import { trackProductEvent } from "@/lib/metaPixel";
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
  /** Shows the "משובץ מואסנייט" stone callout beneath the title. */
  isMoissanite?: boolean;
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
  isMoissanite = false,
}: ProductCardProps) {
  const { addByHandle, openCart } = useCart();

  // Multi-colour pieces let the shopper preview each finish in place.
  const hasSwatches = !!variants && variants.length > 1;
  const [activeColor, setActiveColor] = useState(0);

  // Any image src that failed to load (missing file, blocked host). A failed
  // <Image> otherwise renders the browser's broken-image placeholder (the blue
  // question mark seen on the rose-gold swatch); instead we fall back to the
  // main product image so a card never shows a broken box.
  const [brokenSrcs, setBrokenSrcs] = useState<Set<string>>(() => new Set());
  const markBroken = (src: string) =>
    setBrokenSrcs((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));

  const activeVariant = hasSwatches ? variants![activeColor] : undefined;
  const selectedImage = activeVariant?.image ?? image;
  // Fall back to the main product image if the selected finish's file fails.
  const displayImage = brokenSrcs.has(selectedImage) ? image : selectedImage;

  // Per-finish price + handle: merged products (e.g. a ring whose gold lives on
  // a separate Shopify listing) carry their own; single-listing pieces fall back
  // to the parent, so the swatch updates price/SKU as well as the image.
  const activePrice = activeVariant?.price ?? price;
  const activeHandle = activeVariant?.handle ?? handle;

  // Hover image — mapped PER-PRODUCT: the product's own dedicated hover file
  // (secondaryImage) if it has one, otherwise its second colour/finish. When a
  // product has neither, hoverImage is undefined → no hover, so a card defaults
  // to its primary image and never shows a generic/incorrect shot.
  const rawHoverImage =
    secondaryImage ??
    (variants && variants.length > 1 ? variants[1].image : undefined);
  // Drop the hover image if it failed to load — better no cross-fade than a
  // broken frame flashing in on hover.
  const hoverImage =
    rawHoverImage && !brokenSrcs.has(rawHoverImage) ? rawHoverImage : undefined;

  // Dedicated hover files are full-bleed lifestyle shots (cover); a second
  // finish is a studio product shot (contain, matching the primary framing).
  const hoverIsCover = fit === "cover";

  // Mobile has no hover, so a second image is unreachable on touch. Show a
  // swipeable dot carousel there instead — but only for lifestyle cards with a
  // real second image and no swatches; swatch pieces already switch their image
  // from the swatches. The desktop hover cross-fade is unchanged.
  const cardImageSizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
  const showMobileCarousel = !hasSwatches && !!hoverImage;
  const mobileSlides: CardSlide[] | null = showMobileCarousel
    ? [
        { src: displayImage, className: gridImageClass(category) },
        {
          src: hoverImage!,
          className: hoverIsCover
            ? "object-cover object-center"
            : gridImageClass(category),
        },
      ]
    : null;

  // Quick-add: don't navigate the parent link — add the real Shopify variant.
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeHandle) {
      // AddToCart — use the SELECTED finish's handle + price so a merged
      // product adds the right variant (e.g. gold on its own Shopify listing).
      trackProductEvent("AddToCart", {
        value: activePrice,
        contentId: activeHandle,
        contentName: title,
      });
      addByHandle(activeHandle);
    } else openCart();
  };

  const quickAddLabel = `הוספה מהירה: ${title}`;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col bg-transparent transition-[transform,opacity] duration-300 ease-out touch-manipulation [-webkit-tap-highlight-color:transparent] active:opacity-90 md:hover:-translate-y-1"
    >
      {/* White product-image card — lifts the piece off the warm page so it
          doesn't blend into the background (shared GRID_CARD surface). */}
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden ${GRID_CARD}`}
      >
        {/* Static base image. Hidden on mobile when the swipe carousel takes
            over, so the two don't stack. */}
        <Image
          src={displayImage}
          alt={`${title}, תכשיט כסף מבית Oridor`}
          fill
          sizes={cardImageSizes}
          onError={() => markBroken(selectedImage)}
          className={`${gridImageClass(category)} ${showMobileCarousel ? "hidden sm:block" : ""}`}
        />

        {/* Desktop hover cross-fade to the product's OWN second image. Only
            while the shopper hasn't picked a specific colour, so it never shows
            a wrong item. Hidden on mobile — the carousel handles touch there. */}
        {hoverImage && activeColor === 0 && (
          <Image
            src={hoverImage}
            alt={`${title}, תמונה נוספת`}
            fill
            sizes={cardImageSizes}
            onError={() => markBroken(hoverImage)}
            className={`${hoverIsCover ? "object-cover object-center" : gridImageClass(category)} hidden opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 sm:block`}
          />
        )}

        {/* Mobile swipe carousel + dots (touch alternative to hover). */}
        {mobileSlides && activeColor === 0 && (
          <CardImageCarousel slides={mobileSlides} alt={title} sizes={cardImageSizes} />
        )}

        {/* Minimal status tag — top-right (inline-start in RTL) */}
        {tag && (
          <span className="pointer-events-none absolute start-3 top-3 z-10 bg-canvas/70 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.24em] text-charcoal/80 backdrop-blur-sm">
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

      <div className="flex flex-1 flex-col items-center px-2 pt-4 text-center">
        <h3 className="w-full text-[13px] font-semibold leading-snug tracking-[0.04em] text-charcoal transition-colors duration-300 group-hover:text-gold sm:text-sm">
          {title}
        </h3>
        {/* Material callout: moissanite pieces state the stone, everything else
            states the 925 + rhodium make. Safe for grid alignment: price and CTA
            below are bottom-anchored with mt-auto, so the row always lines up. */}
        {isMoissanite ? (
          <MoissaniteLabel className="mt-1" />
        ) : (
          <SilverLabel className="mt-1" />
        )}

        {/* Bottom group — swatches, price and CTA anchored to the card bottom
            (flex space-between effect via mt-auto), so every card lines up
            regardless of the title/content above. */}
        <div className="mt-auto flex w-full flex-col items-center pt-3">
          {/* Swatch row is rendered ONLY when a product actually has finishes.
              It used to reserve a fixed 44px row on every card to keep prices
              aligned, but most pieces have no swatches, so that left a dead
              band under the subtitle on the majority of the grid. The bottom
              group is still mt-auto anchored, so cards stay tidy. */}
          {hasSwatches && (
            <div className="flex items-center justify-center gap-0.5">
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

          <PriceTag
            price={activePrice}
            compareAt={compareAt}
            className={hasSwatches ? "mt-0.5" : "mt-1.5"}
          />

          {/* Quick Add — visible beneath the price on mobile */}
          <button
            type="button"
            onClick={handleAdd}
            aria-label={quickAddLabel}
            // Refined ghost CTA (mobile only) — a thin outline pill that reads as
            // boutique, not a heavy black slab on every card, yet stays clearly
            // tappable for impulse adds. Fills softly on press.
            className="mt-3 inline-flex w-full items-center justify-center whitespace-nowrap border border-charcoal/25 px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] text-charcoal transition-colors duration-300 ease-out hover:border-charcoal/50 active:bg-charcoal/[0.06] sm:hidden"
          >
            הוספה מהירה
          </button>
        </div>
      </div>
    </Link>
  );
}
