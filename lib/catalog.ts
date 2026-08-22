import { getLiveProducts } from "./shopify";
import type { ShopifyProductOptions, LiveProduct } from "./shopify";

/** The two — and only two — main categories. */
export const COLLECTION_MOISSANITE = "מואסנייט";
export const COLLECTION_SILVER = "כסף 925";

export type CatalogCategory = "Necklaces" | "Bracelets" | "Earrings" | "Rings";

/** A single colour option of a product (e.g. Silver / Gold / Rose Gold). */
export interface ProductColorVariant {
  color: string;
  hex: string;
  image: string;
  /**
   * Per-finish overrides for merged products whose finishes live on DIFFERENT
   * Shopify products (e.g. a ring sold as separate silver and gold listings,
   * combined into one page). `price` shows the finish's own price; `handle`
   * routes add-to-cart to that finish's real Shopify product. Both fall back to
   * the parent product when absent, so single-listing products are unaffected.
   */
  price?: number;
  handle?: string;
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

/** Map one live Shopify product to the shared catalog-card shape. */
function liveToCatalogProduct(lp: LiveProduct): CatalogProduct {
  const haystack = `${lp.title} ${lp.productType} ${lp.tags.join(" ")}`;
  const isMoissanite = /מואסנייט|moissanite/i.test(haystack);
  return {
    id: `live-${lp.handle}`,
    title: lp.title,
    price: lp.price,
    compareAtPrice: lp.compareAtPrice,
    image: lp.image ?? "",
    handle: lp.handle,
    available: lp.available,
    href: `/products/${lp.handle}`,
    collection: isMoissanite ? COLLECTION_MOISSANITE : COLLECTION_SILVER,
    category: inferCategory(lp.title) ?? inferCategoryFromType(lp.productType),
    // Live Shopify photos are full images (not transparent cut-outs), so cover
    // fills the card cleanly.
    fit: "cover",
  };
}

/**
 * Unified shop catalog — now sourced 100% LIVE from Shopify. Whatever is Active
 * (and published to the Storefront channel) shows up; deleted products vanish.
 * Products without an image are skipped. Returns [] if Shopify is unconfigured
 * or unreachable, so the site degrades to an empty catalog instead of erroring.
 */
export async function getLiveCatalog(): Promise<CatalogProduct[]> {
  const live = await getLiveProducts();
  return live.filter((p) => p.image).map(liveToCatalogProduct);
}

/** Infer a category from a Shopify productType (English), as a fallback. */
function inferCategoryFromType(productType: string): CatalogCategory | null {
  const t = productType.toLowerCase();
  if (/ring/.test(t)) return "Rings";
  if (/necklace|pendant|chain/.test(t)) return "Necklaces";
  if (/bracelet|bangle|cuff/.test(t)) return "Bracelets";
  if (/earring|stud|hoop/.test(t)) return "Earrings";
  return null;
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

/**
 * Store-wide default ordering: cheapest first.
 *
 * Applied at every list surface — collection pages, the shop's category chips
 * and search — so price always runs low → high by default, on mobile and
 * desktop alike. Sort by the EFFECTIVE display price, i.e. call this AFTER
 * overlayLivePrices/applyLiveStatus so live Shopify prices order correctly.
 *
 * Returns a new array and is stable (equal-priced items keep their source
 * order). Deliberately NOT baked into overlayLivePrices, which is also used for
 * single PDPs and the curated homepage teaser, where reordering is unwanted.
 */
export function sortByPriceAsc<T extends { price: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.price - b.price);
}

/** Sticky filter chips — mixes collection and type axes; each chip filters one. */
export type Chip =
  | { label: string; kind: "all" }
  | { label: string; kind: "collection"; value: string }
  | { label: string; kind: "category"; value: CatalogCategory };

export const SHOP_CHIPS: Chip[] = [
  { label: "הכל", kind: "all" },
  { label: "מואסנייט", kind: "collection", value: COLLECTION_MOISSANITE },
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
  variants: { color: string; image_url: string; price?: number; handle?: string }[];
}): ShopifyProductOptions {
  return {
    handle: opts.handle,
    options: [{ name: "צבע", values: opts.variants.map((v) => v.color) }],
    variants: opts.variants.map((v) => {
      // A finish may live on its own Shopify product (merged listings); route
      // add-to-cart to that product's handle by encoding it in the synthetic id.
      // The id shape is `local:<target-handle>:<color>`, which the buy box parses
      // to add the correct product. Falls back to the parent handle/price.
      const targetHandle = v.handle ?? opts.handle;
      return {
        id: `local:${targetHandle}:${v.color}`,
        title: v.color,
        price: v.price ?? opts.price,
        currencyCode: "ILS",
        available: true,
        selectedOptions: [{ name: "צבע", value: v.color }],
        image: encodeURI(v.image_url),
      };
    }),
  };
}
