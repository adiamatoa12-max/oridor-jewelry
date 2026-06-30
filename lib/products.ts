export type Category = "Necklaces" | "Bracelets" | "Earrings" | "Rings";

export interface Product {
  id: string;
  title: string;
  price: number;
  category: Category;
  image: string;
  /** Optional lifestyle shot that cross-fades in on hover. */
  secondaryImage?: string;
  /** Optional minimal status tag, e.g. "BEST SELLER". */
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

// Local studio product photos. Hebrew filenames are percent-encoded so the
// paths resolve without 404s.
const img = (n: number) => encodeURI(`/photo/מתן ${n}.jpeg`);

/**
 * Full product catalog — 28 real product photos, each categorised by type.
 * (Image מתן N → category, verified by review of the source photos.)
 */
export const PRODUCTS: Product[] = [
  // ── Bracelets (1–5, 14, 15) ────────────────────────────────────────────
  { id: "matan-1", title: "צמיד טניס סוליטר", price: 350, category: "Bracelets", image: img(1) },
  { id: "matan-2", title: "צמיד שרשרת סוליטר", price: 290, category: "Bracelets", image: img(2) },
  { id: "matan-3", title: "צמיד עדין סוליטר", price: 300, category: "Bracelets", image: img(3) },
  { id: "matan-4", title: "צמיד טיפה", price: 320, category: "Bracelets", image: img(4) },
  { id: "matan-5", title: "צמיד טניס קלאסי", price: 360, category: "Bracelets", image: img(5) },
  { id: "matan-14", title: "צמיד טניס יהלומים", price: 450, category: "Bracelets", image: img(14) },
  { id: "matan-15", title: "צמיד טניס שחור", price: 470, category: "Bracelets", image: img(15) },

  // ── Rings (6–13) ───────────────────────────────────────────────────────
  { id: "matan-6", title: "טבעת סוליטר פאווה", price: 420, category: "Rings", image: img(6) },
  { id: "matan-7", title: "טבעת טיפה פאווה", price: 440, category: "Rings", image: img(7) },
  { id: "matan-8", title: "טבעת מרקיזה סוליטר", price: 460, category: "Rings", image: img(8) },
  { id: "matan-9", title: "טבעת אובל פאווה", price: 450, category: "Rings", image: img(9) },
  { id: "matan-10", title: "טבעת סוליטר עגולה", price: 410, category: "Rings", image: img(10) },
  { id: "matan-11", title: "טבעת הילה עגולה", price: 490, category: "Rings", image: img(11) },
  { id: "matan-12", title: "טבעת חצי נצח", price: 540, category: "Rings", image: img(12) },
  { id: "matan-13", title: "טבעת טיפה סוליטר", price: 470, category: "Rings", image: img(13) },

  // ── Necklaces (16–21) ──────────────────────────────────────────────────
  { id: "matan-16", title: "שרשרת טניס יהלומים", price: 690, category: "Necklaces", image: img(16) },
  { id: "matan-17", title: "שרשרת טניס שחורה", price: 690, category: "Necklaces", image: img(17) },
  { id: "matan-18", title: "שרשרת תליון סוליטר", price: 350, category: "Necklaces", image: img(18) },
  { id: "matan-19", title: "שרשרת תליון", price: 360, category: "Necklaces", image: img(19) },
  { id: "matan-20", title: "שרשרת סוליטר אובל", price: 340, category: "Necklaces", image: img(20) },
  { id: "matan-21", title: "שרשרת מרקיזה", price: 350, category: "Necklaces", image: img(21) },

  // ── Earrings (22–28) ───────────────────────────────────────────────────
  { id: "matan-22", title: "עגילי טיפה הילה", price: 380, category: "Earrings", image: img(22) },
  { id: "matan-23", title: "עגילי לב סוליטר", price: 360, category: "Earrings", image: img(23) },
  { id: "matan-24", title: "עגילי הילה כפולה", price: 420, category: "Earrings", image: img(24) },
  { id: "matan-25", title: "עגילי סוליטר", price: 350, category: "Earrings", image: img(25) },
  { id: "matan-26", title: "עגילי הילה", price: 390, category: "Earrings", image: img(26) },
  { id: "matan-27", title: "עגילי טיפה", price: 370, category: "Earrings", image: img(27) },
  { id: "matan-28", title: "עגילי סוליטר עגול", price: 400, category: "Earrings", image: img(28) },
];

/** Returns the full catalog (kept as a function for call-site compatibility). */
export function buildCatalog(): Product[] {
  return PRODUCTS;
}
