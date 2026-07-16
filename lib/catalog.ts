import moissanite from "@/data/moissanite_collection.json";
import silver from "@/data/silver_collection.json";
import signature from "@/data/signature_collection.json";
import newArrivals from "@/data/new_arrivals.json";
import type { ShopifyProductOptions } from "./shopify";

/** The two — and only two — main categories. */
export const COLLECTION_MOISSANITE = "מואסניט";
export const COLLECTION_SILVER = "כסף 925";

export type CatalogCategory = "Necklaces" | "Bracelets" | "Earrings" | "Rings";

/** A single colour option of a product (e.g. Silver / Gold / Rose Gold). */
export interface ProductColorVariant {
  color: string;
  hex: string;
  image: string;
}

export interface CatalogProduct {
  id: string;
  title: string;
  price: number;
  /** Original ("regular") price for the launch strikethrough, when on promo. */
  compareAtPrice?: number;
  image: string;
  /** Second image that cross-fades in on hover, when available. */
  secondaryImage?: string;
  /** Shopify handle / URL slug — the join key for live price & stock. */
  handle: string;
  /** Live stock flag from Shopify (undefined when live data is unavailable). */
  available?: boolean;
  href: string;
  /** Collection this piece belongs to (Hebrew label). */
  collection: string;
  category: CatalogCategory | null;
  /** How the image should fit — product-on-white shots look best contained. */
  fit: "cover" | "contain";
  /**
   * Colour variants for multi-colour pieces. Present only when the product is
   * genuinely offered in more than one finish (each with its own image asset);
   * single-finish pieces omit this so no swatches are shown.
   */
  variants?: ProductColorVariant[];
}

/** Infer a jewelry type from a Hebrew product name. */
function inferCategory(name: string): CatalogCategory | null {
  if (/טבעת/.test(name)) return "Rings";
  if (/שרשרת/.test(name)) return "Necklaces";
  if (/צמיד|יד/.test(name)) return "Bracelets";
  if (/עגיל|חישוק/.test(name)) return "Earrings";
  return null;
}

const asType = (c?: string): CatalogCategory | null =>
  c === "Rings" || c === "Bracelets" || c === "Necklaces" || c === "Earrings"
    ? c
    : null;

/**
 * Unified shop catalog — every collection in one clean, filterable list.
 * Moissanite pieces keep their studio crop (cover); the silver & signature
 * pieces are shot on white, so they're contained. Signature pieces expose a
 * second colour image for the hover cross-fade.
 */
export function buildUnifiedCatalog(): CatalogProduct[] {
  const moissaniteItems: CatalogProduct[] = (moissanite as any[]).map((p) => ({
    id: `mois-${p.id}`,
    title: p.name,
    price: p.price,
    compareAtPrice: p.compare_at_price,
    image: encodeURI(p.image_url),
    // On-model lifestyle shot that cross-fades in on hover (same as homepage).
    secondaryImage: p.hover_image ? encodeURI(p.hover_image) : undefined,
    handle: p.slug,
    href: `/collections/moissanite/${p.slug}`,
    collection: COLLECTION_MOISSANITE,
    category: asType(p.category),
    fit: "cover",
  }));

  // All solid-silver sources collapse into the single "כסף 925" category.
  const silverItems: CatalogProduct[] = (silver as any[]).map((p) => ({
    id: `silv-${p.id}`,
    title: p.name,
    price: p.price,
    compareAtPrice: p.compare_at_price,
    image: encodeURI(p.image_url),
    handle: p.slug,
    href: `/collections/silver/${p.slug}`,
    collection: COLLECTION_SILVER,
    category: asType(p.category) ?? inferCategory(p.name),
    fit: "contain",
    // Expose colour/metal variants so the shop card shows swatches too.
    variants:
      Array.isArray(p.variants) && p.variants.length > 1
        ? p.variants.map((v: any) => ({
            color: v.color,
            hex: v.hex,
            image: encodeURI(v.image_url),
          }))
        : undefined,
  }));

  const newArrivalItems: CatalogProduct[] = (newArrivals as any[]).map((p) => ({
    id: `na-${p.id}`,
    title: p.name,
    price: p.price,
    compareAtPrice: p.compare_at_price,
    image: encodeURI(p.image_url),
    handle: p.slug,
    href: `/collections/new/${p.slug}`,
    collection: COLLECTION_SILVER,
    category: asType(p.category) ?? inferCategory(p.name),
    fit: "cover",
  }));

  const signatureItems: CatalogProduct[] = (signature as any[]).map((p) => ({
    id: `sig-${p.id}`,
    title: p.name,
    price: p.price,
    compareAtPrice: p.compare_at_price,
    image: encodeURI(p.variants[0].image_url),
    secondaryImage: p.variants[1]?.image_url
      ? encodeURI(p.variants[1].image_url)
      : undefined,
    handle: p.slug,
    href: `/collections/signature/${p.slug}`,
    collection: COLLECTION_SILVER,
    category: asType(p.category) ?? inferCategory(p.name),
    fit: "contain",
    // Only surface swatches when there's genuinely more than one finish.
    variants:
      p.variants.length > 1
        ? p.variants.map((v: any) => ({
            color: v.color,
            hex: v.hex,
            image: encodeURI(v.image_url),
          }))
        : undefined,
  }));

  return [
    ...moissaniteItems,
    ...silverItems,
    ...newArrivalItems,
    ...signatureItems,
  ];
}

/**
 * Hybrid overlay: given the local catalog and a live { handle → status } map
 * from Shopify, return a new list with LIVE price + availability applied.
 * Products with no live match keep their local price and are treated as
 * available (so an unconfigured/empty map is a safe no-op).
 */
export function applyLiveStatus<
  T extends { handle: string; price: number; compareAtPrice?: number },
>(
  products: T[],
  live: Record<
    string,
    { price: number; compareAtPrice?: number; available: boolean }
  >,
): (T & { available?: boolean })[] {
  return products.map((p) => {
    const status = live[p.handle];
    if (!status) return p;
    // Price AND strikethrough both come from Shopify so they never disagree.
    return {
      ...p,
      price: status.price,
      compareAtPrice: status.compareAtPrice,
      available: status.available,
    };
  });
}

/**
 * Overlay live Shopify prices onto raw catalog items (the {slug, price,
 * compare_at_price} shape the collection grids use). Shopify is the single
 * source of truth: any item whose slug matches a live handle takes the Shopify
 * price + compare-at. Items with no live match keep their JSON price, so an
 * unconfigured/empty map is a safe no-op (nothing breaks before Shopify is set).
 */
export function overlayLivePrices<
  T extends { slug: string; price: number; compare_at_price?: number },
>(
  products: T[],
  live: Record<string, { price: number; compareAtPrice?: number }>,
): T[] {
  return products.map((p) => {
    const status = live[p.slug];
    if (!status) return p;
    return { ...p, price: status.price, compare_at_price: status.compareAtPrice };
  });
}

/** Sticky filter chips — mixes collection and type axes; each chip filters one. */
export type Chip =
  | { label: string; kind: "all" }
  | { label: string; kind: "collection"; value: string }
  | { label: string; kind: "category"; value: CatalogCategory };

export const SHOP_CHIPS: Chip[] = [
  { label: "הכל", kind: "all" },
  { label: "מואסניט", kind: "collection", value: COLLECTION_MOISSANITE },
  { label: "כסף 925", kind: "collection", value: COLLECTION_SILVER },
  { label: "שרשראות", kind: "category", value: "Necklaces" },
  { label: "טבעות", kind: "category", value: "Rings" },
  { label: "צמידים", kind: "category", value: "Bracelets" },
  { label: "עגילים", kind: "category", value: "Earrings" },
];

const COLOR_OPTION_RE = /צבע|color|מתכת|metal|גימור|finish/i;
const CARAT_OPTION_RE = /קראט|carat|ct\b/i;

/** True when the Shopify product exposes a real multi-value colour option. */
export function hasColorOption(p: ShopifyProductOptions | null): boolean {
  return !!p?.options.some(
    (o) => COLOR_OPTION_RE.test(o.name) && o.values.length > 1,
  );
}

/** True when the Shopify product already exposes a carat option. */
export function hasCaratOption(p: ShopifyProductOptions | null): boolean {
  return !!p?.options.some((o) => CARAT_OPTION_RE.test(o.name));
}

/**
 * Frontend-only carat options synthesised from local data, so the PDP shows the
 * carat selector (and switches price) even before the carat variants exist in
 * Shopify. Synthetic `local:` ids route add-to-cart through the product handle.
 */
export function localCaratOptions(opts: {
  handle: string;
  variants: { carat: string; price: number }[];
}): ShopifyProductOptions {
  return {
    handle: opts.handle,
    options: [{ name: "קראט", values: opts.variants.map((v) => v.carat) }],
    variants: opts.variants.map((v) => ({
      id: `local:${opts.handle}:${v.carat}`,
      title: v.carat,
      price: v.price,
      currencyCode: "ILS",
      available: true,
      selectedOptions: [{ name: "קראט", value: v.carat }],
    })),
  };
}

/**
 * Frontend-only colour options synthesised from local variant data. Used when
 * Shopify doesn't expose a colour option for a product (e.g. the colours are
 * still separate Shopify products) so the PDP can still render the colour
 * selector and swap images locally — without any change to Shopify.
 *
 * The synthetic variant ids are prefixed `local:` so the buy box knows to add
 * the product by handle (the real Shopify product) instead of by a variant id
 * that doesn't exist in Shopify.
 */
export function localColorOptions(opts: {
  handle: string;
  price: number;
  variants: { color: string; image_url: string }[];
}): ShopifyProductOptions {
  return {
    handle: opts.handle,
    options: [{ name: "צבע", values: opts.variants.map((v) => v.color) }],
    variants: opts.variants.map((v) => ({
      id: `local:${opts.handle}:${v.color}`,
      title: v.color,
      price: opts.price,
      currencyCode: "ILS",
      available: true,
      selectedOptions: [{ name: "צבע", value: v.color }],
      image: encodeURI(v.image_url),
    })),
  };
}
