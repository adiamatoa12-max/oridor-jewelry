"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "./CartContext";
import { usePdpImageSync } from "./PdpImageSync";
import PriceTag from "./PriceTag";
import SizeSelector from "./SizeSelector";
import type {
  ShopifyProductOptions,
  ShopifyVariant,
} from "@/lib/shopify";


// Option axes rendered as colour swatches vs. text pills. Anything that reads
// like a colour/material is a swatch; everything else (Carat, Size, …) is a pill.
const SWATCH_OPTION = /צבע|color|material|חומר|גימור|finish|metal|מתכת/i;

function optionIsSwatch(name: string) {
  return SWATCH_OPTION.test(name);
}

/**
 * Premium product buy box driven by live Shopify options + variants.
 *
 * - Colour/Material options → elegant swatches (hex from `hexByValue`).
 * - Carat/Size/other options → clickable pill buttons.
 * - Selecting any option resolves the matching Shopify variant, updates the
 *   displayed price, and passes that variant's ID to the cart.
 *
 * Single-variant products (Shopify's default "Title / Default Title") render
 * no option controls — just the price and the add-to-cart button.
 */
export default function ProductBuyBox({
  title,
  image,
  fallbackPrice,
  compareAtPrice,
  product,
  hexByValue = {},
  imageByValue = {},
  sizes = [],
  handle,
}: {
  title: string;
  image: string;
  /** Local price shown when a variant can't be resolved. */
  fallbackPrice: number;
  /** Regular price for the launch strikethrough (optional). */
  compareAtPrice?: number;
  /** Live Shopify options + variants; null when Shopify is unavailable. */
  product: ShopifyProductOptions | null;
  /** Optional map of option value → hex, for colour swatches. */
  hexByValue?: Record<string, string>;
  /** Optional map of option value → image src, to swap the gallery on select. */
  imageByValue?: Record<string, string>;
  /** Local (presentational) size options, rendered between price and CTA. */
  sizes?: string[];
  /** Product handle — used to add-to-cart when the selected variant is a
   *  frontend-only (`local:`) colour synthesised from local data. */
  handle?: string;
}) {
  const { addVariant, addByHandle } = useCart();
  const imageSync = usePdpImageSync();

  // Flag the sticky mobile CTA's presence on <body> so the global floating
  // widgets (WhatsApp, accessibility) lift above it on phones and never cover
  // the price or "add to cart" button. Cleaned up on unmount.
  useEffect(() => {
    document.body.setAttribute("data-pdp-cta", "");
    return () => document.body.removeAttribute("data-pdp-cta");
  }, []);

  // Real, selectable option axes only (drop Shopify's synthetic "Title" axis).
  const options = useMemo(
    () =>
      (product?.options ?? []).filter(
        (o) =>
          o.name.toLowerCase() !== "title" &&
          !(o.values.length === 1 && o.values[0] === "Default Title"),
      ),
    [product],
  );

  const variants = product?.variants ?? [];

  // Default selection: the first available variant (or the first variant).
  const initial = useMemo<Record<string, string>>(() => {
    const base = variants.find((v) => v.available) ?? variants[0];
    const sel: Record<string, string> = {};
    base?.selectedOptions.forEach((o) => (sel[o.name] = o.value));
    return sel;
  }, [variants]);

  const [selected, setSelected] = useState<Record<string, string>>(initial);

  // Resolve the variant that matches every currently-selected option value.
  const currentVariant: ShopifyVariant | undefined = useMemo(() => {
    if (!variants.length) return undefined;
    return variants.find((v) =>
      v.selectedOptions.every((o) => selected[o.name] === o.value),
    );
  }, [variants, selected]);

  const price = currentVariant?.price ?? fallbackPrice;
  const soldOut = currentVariant ? !currentVariant.available : false;

  // Whenever the resolved variant changes, show its image in the gallery.
  // Prefer the variant's own Shopify image; fall back to the local option→image
  // map (used by collections whose variant images live in the JSON data).
  // Do the Shopify variant images actually differ per colour? (If they all
  // point to the same image, there's nothing to swap.)
  const variantImagesVary = useMemo(
    () => new Set(variants.map((v) => v.image).filter(Boolean)).size > 1,
    [variants],
  );

  // Depend on the SETTER (referentially stable from useState), never on the
  // whole sync context: that object's identity changes every time activeSrc
  // changes, which would re-fire this effect and immediately overwrite a
  // gallery thumbnail the shopper just clicked.
  const setActiveSrc = imageSync?.setActiveSrc;

  useEffect(() => {
    if (!setActiveSrc || variants.length <= 1) return;
    // Prefer the page's curated per-colour image map (distinct local assets);
    // otherwise use the selected variant's own Shopify image, but only when the
    // variants genuinely have different images. Single-image variant sets keep
    // the curated local gallery.
    const localSrc = currentVariant?.selectedOptions
      .map((o) => imageByValue[o.value])
      .find(Boolean);
    const src = localSrc ?? (variantImagesVary ? currentVariant?.image : undefined);
    if (src) setActiveSrc(src);
  }, [currentVariant, imageByValue, setActiveSrc, variants.length, variantImagesVary]);

  const choose = (optName: string, value: string) => {
    setSelected((s) => ({ ...s, [optName]: value }));
    // Immediate feedback from the local map (the effect above then reconciles
    // to the resolved variant's Shopify image when available).
    const src = imageByValue[value];
    if (src) imageSync?.setActiveSrc(src);
  };

  const handleAdd = () => {
    if (!currentVariant) return; // no variant resolved → nothing to add
    // Synthetic frontend-only colours (see localColorOptions) have no real
    // Shopify variant id — add the underlying product by its handle instead.
    if (currentVariant.id.startsWith("local:")) {
      if (handle) addByHandle(handle);
      return;
    }
    addVariant(currentVariant.id, 1);
  };

  // Reveal the sticky mobile bar only once the user has scrolled PAST the main
  // CTA (its bottom edge is above the viewport top) — not while it's still
  // below the fold. A scroll/resize check is used instead of IntersectionObserver
  // because the latter only fires on viewport crossings, so moving from above →
  // below the viewport (jump-to-top, anchor links) wouldn't update the state.
  const mainCtaRef = useRef<HTMLButtonElement>(null);
  const [ctaVisible, setCtaVisible] = useState(true);
  useEffect(() => {
    const el = mainCtaRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      // ctaVisible === true means "don't show the sticky bar": the main CTA is
      // in view or still below the fold. Show only once it's fully scrolled off
      // the top (bottom <= 0).
      setCtaVisible(el.getBoundingClientRect().bottom > 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div>
      <PriceTag price={price} compareAt={compareAtPrice} size="lg" className="mt-4" />

      {options.map((opt) => {
        const swatch = optionIsSwatch(opt.name);
        return (
          <div key={opt.name} className="mt-7">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ash">
              {opt.name}
              {selected[opt.name] && (
                <span className="ms-2 tracking-normal text-charcoal">
                  {selected[opt.name]}
                </span>
              )}
            </p>

            {swatch ? (
              /* Colour / material swatches */
              <div className="flex flex-wrap items-center gap-3">
                {opt.values.map((value) => {
                  const on = selected[opt.name] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-label={value}
                      aria-pressed={on}
                      title={value}
                      onClick={() => choose(opt.name, value)}
                      className="inline-flex h-10 w-10 items-center justify-center"
                    >
                      <span
                        className={`h-6 w-6 rounded-full border transition-all duration-200 ${
                          on
                            ? "scale-110 border-charcoal ring-1 ring-charcoal/30 ring-offset-2"
                            : "border-platinum/70"
                        }`}
                        style={{ backgroundColor: hexByValue[value] ?? "#E8E8E8" }}
                      />
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Carat / Size / other → pill buttons */
              <div className="flex flex-wrap gap-2.5">
                {opt.values.map((value) => {
                  const on = selected[opt.name] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => choose(opt.name, value)}
                      className={`min-h-[42px] rounded-full border px-5 text-xs tracking-wide transition-all duration-300 ease-out ${
                        on
                          ? "border-charcoal bg-charcoal text-canvas"
                          : "border-platinum/70 bg-canvas text-graphite hover:border-charcoal/50 hover:text-charcoal"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Local size options — between the configurator and the CTA. */}
      {sizes.length > 0 && <SizeSelector sizes={sizes} />}

      {/* Add to cart — high-contrast solid CTA so it stands out as the primary
          action: solid charcoal on the pale page, shifting to gold on hover. */}
      <button
        ref={mainCtaRef}
        type="button"
        onClick={handleAdd}
        disabled={soldOut || !currentVariant}
        className="group mt-9 inline-flex min-h-[56px] w-full items-center justify-center border border-charcoal bg-charcoal px-10 text-[11px] font-medium uppercase tracking-[0.28em] text-canvas shadow-[0_10px_30px_-12px_rgba(26,26,26,0.55)] transition-all duration-500 ease-cinematic hover:border-gold hover:bg-gold hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite disabled:cursor-not-allowed disabled:border-platinum disabled:bg-platinum/40 disabled:text-ash disabled:opacity-70 disabled:shadow-none"
      >
        {soldOut ? "אזל מהמלאי" : "הוספה לאוסף"}
      </button>

      {/* Trust micro-copy at the point of conversion. */}
      <p className="mt-3 text-center text-[11px] font-light tracking-wide text-ash">
        משלוח חינם והחזרות פשוטות
      </p>

      {/* Sticky mobile CTA — fades in only once the main button is scrolled
          out of view. Shows a brief (truncated) title + price and shares the
          same handler. Subtle upward drop shadow lifts it off the page. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-platinum/40 bg-canvas/95 px-5 py-3 shadow-[0_-6px_24px_-10px_rgba(26,26,26,0.22)] backdrop-blur-md transition-all duration-500 ease-cinematic sm:hidden ${
          ctaVisible
            ? "pointer-events-none translate-y-1 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium leading-tight text-charcoal">
            {title}
          </p>
          <PriceTag price={price} compareAt={compareAtPrice} />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut || !currentVariant}
          className="btn-primary ms-auto flex-none px-8 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {soldOut ? "אזל מהמלאי" : "הוספה לאוסף"}
        </button>
      </div>
    </div>
  );
}
