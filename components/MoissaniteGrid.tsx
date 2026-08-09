"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import PriceTag from "./PriceTag";
import { gridImageClass, GRID_CARD } from "@/lib/gridImage";
import MoissaniteLabel from "./MoissaniteLabel";
import CardImageCarousel from "./CardImageCarousel";

/** Shared responsive sizes for the card image and its carousel slides. */
const CARD_SIZES = "(min-width: 1024px) 25vw, 62vw";

export interface MoissaniteProduct {
  id: string;
  name: string;
  price: number;
  /** Regular price for the launch strikethrough (optional). */
  compare_at_price?: number;
  carat: number;
  material: string;
  image_url: string;
  /** Optional lifestyle/on-model shot that fades in on hover/touch. */
  hover_image?: string;
  /** Extra product-page gallery slides. PDP only — never used by the grid. */
  gallery_images?: string[];
  /** Optional per-product PDP description that overrides the collection default. */
  description?: string;
  /** Optional stone-size spec (e.g. "2-4 mm"), shown by the buy-box selectors. */
  size?: string;
  slug: string;
  /** Category key for filtering (Rings/Bracelets/Necklaces/Earrings). */
  category?: string;
  /** Carat options (stone-weight → price) for the PDP variant selector. */
  caratVariants?: { carat: string; price: number }[];
}


/**
 * Moissanite collection grid.
 * Responsive glassmorphism cards (translucent + blurred) with strictly framed
 * portrait images. Links through to each product's detail page.
 */
export default function MoissaniteGrid({
  products,
  layout = "carousel",
}: {
  products: MoissaniteProduct[];
  /**
   * "carousel" — mobile horizontal snap-scroll (used on the homepage preview).
   * "grid" — a standard vertical 2-col grid on mobile (used on collection pages
   * so every product is visible by scrolling down).
   */
  layout?: "carousel" | "grid";
}) {
  const { addByHandle } = useCart();

  const containerClass =
    layout === "grid"
      ? "grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-7 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-14"
      : "hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 sm:-mx-10 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:px-0";
  // Seamless card — gentle lift on hover; no tap-highlight flash on touch.
  const hoverClass =
    "bg-transparent transition-transform duration-300 ease-out touch-manipulation [-webkit-tap-highlight-color:transparent] md:hover:-translate-y-1";
  const itemClass =
    layout === "grid"
      ? `group block ${hoverClass}`
      : `group block w-[62%] flex-shrink-0 snap-start sm:w-[42%] lg:w-auto ${hoverClass}`;

  const quickAdd = (e: React.MouseEvent, p: MoissaniteProduct) => {
    // Inside a <Link>; don't navigate — add the real Shopify variant + open.
    e.preventDefault();
    e.stopPropagation();
    addByHandle(p.slug);
  };

  // Safety: render each product exactly once, even if the source list contains
  // accidental duplicates (deduped by unique slug).
  const seen = new Set<string>();
  const uniqueProducts = products.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return (
    <div className={containerClass}>
      {uniqueProducts.map((p) => (
        <MoissaniteCard
          key={p.id}
          p={p}
          itemClass={itemClass}
          onQuickAdd={quickAdd}
          // The in-card image swipe (pan-x) is only safe in the vertical grid.
          // In the horizontal carousel row it would eat the swipe meant to
          // scroll between products, so disable it there.
          enableImageSwipe={layout === "grid"}
        />
      ))}
    </div>
  );
}

/** A single moissanite card: primary shot with an on-model image that
 *  cross-fades in on hover. */
function MoissaniteCard({
  p,
  itemClass,
  onQuickAdd,
  enableImageSwipe,
}: {
  p: MoissaniteProduct;
  itemClass: string;
  onQuickAdd: (e: React.MouseEvent, p: MoissaniteProduct) => void;
  /** Render the mobile in-card image carousel (only in the vertical grid). */
  enableImageSwipe: boolean;
}) {
  const showCarousel = Boolean(p.hover_image) && enableImageSwipe;
  return (
    <Link href={`/collections/moissanite/${p.slug}`} className={`${itemClass} touch-manipulation`}>
      {/* White product-image card — lifts the piece off the warm page so it
          doesn't blend into the background (shared GRID_CARD surface). */}
      <div className={`relative aspect-[4/5] w-full overflow-hidden ${GRID_CARD}`}>
        {/* Static base image. Hidden on mobile only when the swipe carousel takes
            over, so the two don't stack. In the horizontal row (no carousel) it
            stays visible so the row scrolls freely. */}
        <Image
          src={encodeURI(p.image_url)}
          alt={`${p.name}, ${p.material}`}
          fill
          sizes={CARD_SIZES}
          className={`${gridImageClass(p.category)} ${showCarousel ? "hidden sm:block" : ""}`}
        />

        {/* Desktop hover cross-fade to this product's OWN dedicated hover image.
            Hidden on mobile — the carousel handles touch there. Deliberately NOT
            group-active: on touch :active fires while tapping and would swap the
            photo mid-tap instead of opening the product. */}
        {p.hover_image && (
          <Image
            src={encodeURI(p.hover_image)}
            alt={`${p.name}, תמונה נוספת`}
            fill
            sizes={CARD_SIZES}
            className="hidden object-cover object-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 sm:block"
          />
        )}

        {/* Mobile swipe carousel (touch alternative to hover) — grid layout
            only; in the horizontal carousel row it would trap the row swipe. */}
        {enableImageSwipe && p.hover_image && (
          <CardImageCarousel
            slides={[
              { src: encodeURI(p.image_url), className: gridImageClass(p.category) },
              { src: encodeURI(p.hover_image), className: "object-cover object-center" },
            ]}
            alt={p.name}
            sizes={CARD_SIZES}
          />
        )}

        {/* Minimalist quick-add — a subtle outline chip that fades in on hover */}
        <button
          type="button"
          onClick={(e) => onQuickAdd(e, p)}
          aria-label={`הוספת ${p.name} לאוסף`}
          className="pointer-events-none absolute inset-x-4 bottom-4 flex translate-y-2 items-center justify-center gap-2 border border-charcoal/15 bg-canvas/85 py-2.5 text-[11px] tracking-[0.15em] text-charcoal opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-200 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 hover:border-charcoal/40"
        >
          <ShoppingBag size={14} strokeWidth={1.5} />
          הוספה לאוסף
        </button>
      </div>

      <div className="px-2 pt-4 text-right">
        <h3 className="min-h-[2.25rem] text-[13px] font-semibold leading-snug tracking-[0.04em] text-charcoal transition-colors duration-300 group-hover:text-gold sm:text-sm">
          {p.name}
        </h3>
        {/* Every piece in this grid is set with moissanite by definition. */}
        <MoissaniteLabel className="mt-1" />
        <PriceTag price={p.price} compareAt={p.compare_at_price} className="mt-1.5" />
      </div>
    </Link>
  );
}
