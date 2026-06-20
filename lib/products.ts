export type Category = "Necklaces" | "Bracelets" | "Earrings" | "Rings";

export interface Product {
  id: string;
  title: string;
  price: number;
  category: Category;
  image: string;
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

/** Ten base pieces spanning all four categories. */
export const BASE_PRODUCTS: Omit<Product, "id">[] = [
  { title: "שרשרת תליון Lumen", price: 220, category: "Necklaces", image: IMG.necklace },
  { title: "שרשרת Aria", price: 245, category: "Necklaces", image: IMG.necklace },
  { title: "שרשרת Celeste", price: 280, category: "Necklaces", image: IMG.necklace },
  { title: "צמיד שרשרת Filament", price: 190, category: "Bracelets", image: IMG.bracelet },
  { title: "צמיד טניס Étoile", price: 320, category: "Bracelets", image: IMG.bracelet },
  { title: "עגילי חישוק Étoile", price: 165, category: "Earrings", image: IMG.earring },
  { title: "עגילי צמוד Mira", price: 140, category: "Earrings", image: IMG.earring },
  { title: "טבעת סוליטר Aria", price: 280, category: "Rings", image: IMG.ring },
  { title: "טבעת Pavé", price: 240, category: "Rings", image: IMG.ring },
  { title: "טבעת Eclipse", price: 200, category: "Rings", image: IMG.ring },
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
