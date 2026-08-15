/**
 * Owner-curated product badges shown on collection cards.
 *
 * These are marketing labels the store chooses (not computed from live sales),
 * so they stay editable here in one place:
 *   · "רב מכר" (Best Seller) — a curated flagship set of slugs below.
 *   · "חדש" (New) — applied to every card in the new-arrivals grid (pass
 *     { isNew: true }); Best Seller takes precedence when a piece is both.
 */
export type ProductBadge = { label: string; kind: "bestseller" | "new" };

/** Flagship pieces to highlight as best sellers. Edit freely. */
const BEST_SELLERS = new Set<string>([
  "silver-1", // טבעת מרקיזה
  "silver-46", // טבעת אטרניטי יוקרתית
  "silver-39", // עגילי טיפה נטיפים
  "silver-13", // שרשרת טיפה כפולה
  "matan-6", // טבעת סוליטר פאווה
  "matan-28", // עגילי סוליטר עגול
  "matan-18", // שרשרת תליון סוליטר
]);

/** Resolve the badge for a product, or null when it shouldn't carry one. */
export function badgeForSlug(slug: string, opts?: { isNew?: boolean }): ProductBadge | null {
  if (BEST_SELLERS.has(slug)) return { label: "רב מכר", kind: "bestseller" };
  if (opts?.isNew) return { label: "חדש", kind: "new" };
  return null;
}
