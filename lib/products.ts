export type Category = "Necklaces" | "Bracelets" | "Earrings" | "Rings";

export interface Product {
  id: string;
  title: string;
  price: number;
  category: Category;
  image: string;
  /** Lifestyle shot that cross-fades in on hover. */
  secondaryImage?: string;
  /** Minimal status tag, e.g. "BEST SELLER". */
  tag?: string;
}

export const CATEGORIES: Category[] = [
  "Necklaces",
  "Bracelets",
  "Earrings",
  "Rings",
];

/** Hebrew display labels for category keys. */
export const CATEGORY_LABELS: Record<Category, string> = {
  Necklaces: "שרשראות",
  Bracelets: "צמידים",
  Earrings: "עגילים",
  Rings: "טבעות",
};

// Clean white-background product shots reused across the catalog.
const IMG = {
  necklace:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
  earring:
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
  bracelet:
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80",
  ring:
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
};

// Lifestyle shots that cross-fade in on hover.
const LIFESTYLE =
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80";

/** Ten base pieces spanning all four categories. */
export const BASE_PRODUCTS: Omit<Product, "id">[] = [
  { title: "שרשרת תליון Lumen", price: 220, category: "Necklaces", image: IMG.necklace, secondaryImage: LIFESTYLE, tag: "BEST SELLER" },
  { title: "שרשרת Aria", price: 245, category: "Necklaces", image: IMG.necklace, secondaryImage: LIFESTYLE },
  { title: "שרשרת Celeste", price: 280, category: "Necklaces", image: IMG.necklace, secondaryImage: LIFESTYLE },
  { title: "צמיד שרשרת Filament", price: 190, category: "Bracelets", image: IMG.bracelet, secondaryImage: LIFESTYLE },
  { title: "צמיד טניס Étoile", price: 320, category: "Bracelets", image: IMG.bracelet, secondaryImage: LIFESTYLE, tag: "LIMITED EDITION" },
  { title: "עגילי חישוק Étoile", price: 165, category: "Earrings", image: IMG.earring, secondaryImage: LIFESTYLE },
  { title: "עגילי צמוד Mira", price: 140, category: "Earrings", image: IMG.earring, secondaryImage: LIFESTYLE },
  { title: "טבעת סוליטר Aria", price: 280, category: "Rings", image: IMG.ring, secondaryImage: LIFESTYLE, tag: "BEST SELLER" },
  { title: "טבעת Pavé", price: 240, category: "Rings", image: IMG.ring, secondaryImage: LIFESTYLE },
  { title: "טבעת Eclipse", price: 200, category: "Rings", image: IMG.ring, secondaryImage: LIFESTYLE },
];

/**
 * Build a catalog of `copies × BASE_PRODUCTS.length` items with unique IDs.
 * Default 4 copies → 40 products, for testing how a large grid scrolls.
 */
export function buildCatalog(copies = 4): Product[] {
  const catalog: Product[] = [];
  for (let c = 0; c < copies; c += 1) {
    BASE_PRODUCTS.forEach((p, i) => {
      catalog.push({ ...p, id: `${i}-${c}` });
    });
  }
  return catalog;
}
