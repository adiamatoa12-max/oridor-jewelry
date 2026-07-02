import moissanite from "@/data/moissanite_collection.json";
import silver from "@/data/silver_collection.json";
import signature from "@/data/signature_collection.json";

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
    collection: "מואסניט",
    category: asType(p.category),
    fit: "cover",
  }));

  const silverItems: CatalogProduct[] = (silver as any[]).map((p) => ({
    id: `silv-${p.id}`,
    title: p.name,
    price: p.price,
    image: encodeURI(p.image_url),
    href: `/collection/silver/${p.slug}`,
    collection: "קולקציית כסף",
    category: inferCategory(p.name),
    fit: "contain",
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
    collection: "קולקציית החתימה",
    category: asType(p.category) ?? inferCategory(p.name),
    fit: "contain",
  }));

  return [...moissaniteItems, ...silverItems, ...signatureItems];
}

/** Sticky filter chips — mixes collection and type axes; each chip filters one. */
export type Chip =
  | { label: string; kind: "all" }
  | { label: string; kind: "collection"; value: string }
  | { label: string; kind: "category"; value: CatalogCategory };

export const SHOP_CHIPS: Chip[] = [
  { label: "הכל", kind: "all" },
  { label: "מואסניט", kind: "collection", value: "מואסניט" },
  { label: "קולקציית כסף", kind: "collection", value: "קולקציית כסף" },
  { label: "קולקציית החתימה", kind: "collection", value: "קולקציית החתימה" },
  { label: "שרשראות", kind: "category", value: "Necklaces" },
  { label: "טבעות", kind: "category", value: "Rings" },
  { label: "צמידים", kind: "category", value: "Bracelets" },
  { label: "עגילים", kind: "category", value: "Earrings" },
];
