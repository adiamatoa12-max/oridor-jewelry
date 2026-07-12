"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "./CartContext";
import { usePdpImageSync } from "./PdpImageSync";
import PriceTag from "./PriceTag";
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
}) {
  const { addVariant } = useCart();
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

  useEffect(() => {
    if (!imageSync || variants.length <= 1) return;
    // Prefer the page's curated per-colour image map (distinct local assets);
    // otherwise use the selected variant's own Shopify image, but only when the
    // variants genuinely have different images. Single-image variant sets keep
    // the curated local gallery.
    const localSrc = currentVariant?.selectedOptions
      .map((o) => imageByValue[o.value])
      .find(Boolean);
    const src = localSrc ?? (variantImagesVary ? currentVariant?.image : undefined);
    if (src) imageSync.setActiveSrc(src);
  }, [currentVariant, imageByValue, imageSync, variants.length, variantImagesVary]);

  const choose = (optName: string, value: string) => {
    setSelected((s) => ({ ...s, [optName]: value }));
    // Immediate feedback from the local map (the effect above then reconciles
    // to the resolved variant's Shopify image when available).
    const src = imageByValue[value];
    if (src) imageSync?.setActiveSrc(src);
  };

  const handleAdd = () => {
    if (!currentVariant) return; // no Shopify variant → nothing to add
    addVariant(currentVariant.id, 1);
  };

  // Reveal the sticky mobile bar only once the main CTA scrolls out of view.
  const mainCtaRef = useRef<HTMLButtonElement>(null);
  const [ctaVisible, setCtaVisible] = useState(true);
  useEffect(() => {
    const el = mainCtaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setCtaVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -8px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
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

      <button
        ref={mainCtaRef}
        type="button"
        onClick={handleAdd}
        disabled={soldOut || !currentVariant}
        className="btn-primary mt-8 w-full py-4 text-xs disabled:cursor-not-allowed disabled:opacity-50"
      >
        {soldOut ? "אזל מהמלאי" : "הוספה לאוסף"}
      </button>

      {/* Sticky mobile CTA — slides up only once the main button is scrolled
          out of view. Shows a brief title + price and shares the same handler. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-platinum/50 bg-canvas/95 px-5 py-3 backdrop-blur-md transition-all duration-300 ease-cinematic sm:hidden ${
          ctaVisible
            ? "pointer-events-none translate-y-full opacity-0"
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
