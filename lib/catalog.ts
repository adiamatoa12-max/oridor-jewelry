import moissanite from "@/data/moissanite_collection.json";
import silver from "@/data/silver_collection.json";
import signature from "@/data/signature_collection.json";
import newArrivals from "@/data/new_arrivals.json";

/** The two — and only two — main categories. */
export const COLLECTION_MOISSANITE = "מואסניט";
export const COLLECTION_SILVER = "כסף 925";

export type CatalogCategory = "Necklaces" | "Bracelets" | "Earrings" | "Rings";

export interface CatalogProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  /** Second image that cross-fades in on hover, when available. */
  secondaryImage?: string;
  href: string;
  /** Collection this piece belongs to (Hebrew label). */
  collection: string;
  category: CatalogCategory | null;
  /** How the image should fit — product-on-white shots look best contained. */
  fit: "cover" | "contain";
}

/** Infer a jewelry type from a Hebrew product name. */
function inferCategory(name: string): CatalogCategory | null {
  if (/טבעת/.test(name)) return "Rings";
  if (/שרשרת/.test(name)) return "Necklaces";
  if (/צמיד|יד/.test(name)) return "Bracelets";
  if (/עגיל/.test(name)) return "Earrings";
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
    image: encodeURI(p.image_url),
    href: `/collection/moissanite/${p.slug}`,
    collection: COLLECTION_MOISSANITE,
    category: asType(p.category),
    fit: "cover",
  }));

  // All solid-silver sources collapse into the single "כסף 925" category.
  const silverItems: CatalogProduct[] = (silver as any[]).map((p) => ({
    id: `silv-${p.id}`,
    title: p.name,
    price: p.price,
    image: encodeURI(p.image_url),
    href: `/collection/silver/${p.slug}`,
    collection: COLLECTION_SILVER,
    category: asType(p.category) ?? inferCategory(p.name),
    fit: "contain",
  }));

  const newArrivalItems: CatalogProduct[] = (newArrivals as any[]).map((p) => ({
    id: `na-${p.id}`,
    title: p.name,
    price: p.price,
    image: encodeURI(p.image_url),
    href: `/collection/new/${p.slug}`,
    collection: COLLECTION_SILVER,
    category: asType(p.category) ?? inferCategory(p.name),
    fit: "cover",
  }));

  const signatureItems: CatalogProduct[] = (signature as any[]).map((p) => ({
    id: `sig-${p.id}`,
    title: p.name,
    price: p.price,
    image: encodeURI(p.variants[0].image_url),
    secondaryImage: p.variants[1]?.image_url
      ? encodeURI(p.variants[1].image_url)
      : undefined,
    href: `/collection/signature/${p.slug}`,
    collection: COLLECTION_SILVER,
    category: asType(p.category) ?? inferCategory(p.name),
    fit: "contain",
  }));

  return [
    ...moissaniteItems,
    ...silverItems,
    ...newArrivalItems,
    ...signatureItems,
  ];
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
