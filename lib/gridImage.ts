/**
 * Category-aware class list for a product-grid image.
 *
 * Product shots sit on white and were framed for their own proportions, so a
 * plain `object-contain` leaves long, delicate pieces (necklaces) looking tiny
 * next to rings. For contained shots we zoom those in — less padding + a base
 * scale — so every category reads with consistent visual weight. `cover` shots
 * (e.g. lifestyle crops) already fill the frame, so they're left alone. Every
 * image gets a smooth hover zoom for an instant close-up.
 *
 * The base scale + `group-hover` scale share one element; the hover value is
 * always larger than the base, so hovering zooms in (never out).
 */
// The jewellery's own contact shadow. Two chained drop-shadows — a tight, dark
// one for the grounding contact edge and a wider, softer one for ambient depth
// — so a cut-out piece reads as resting ON the tile with real dimension rather
// than pasted flat onto it. Contained shots only; cover crops fill the frame.
const SHADOW =
  "[filter:drop-shadow(0px_3px_5px_rgba(0,0,0,0.07))_drop-shadow(0px_14px_20px_rgba(0,0,0,0.12))]";

/**
 * The product-image CARD surface, shared by every grid so cards look identical
 * across collections.
 *
 * Boutique treatment: each product sits on a CRISP WHITE tile (`bg-canvas`,
 * #FFFFFF) lifted off the warm off-white page (#FAF9F6) so pale silver/white
 * jewellery no longer blends into the background. A hairline platinum ring
 * defines the tile edge and a soft resting shadow gives it real dimension on
 * every device (the resting shadow matters on touch, where hover never fires);
 * the shadow then deepens on hover for a subtle lift. The `rounded-2xl
 * overflow-hidden` frame crops any full-bleed lifestyle (cover) shot into a
 * clean rounded photo. Pair with `relative aspect-[4/5] w-full overflow-hidden`,
 * on a card whose outer element carries `group`.
 */
export const GRID_CARD =
  "rounded-2xl bg-canvas ring-1 ring-platinum/40 " +
  // Soft resting shadow (visible on mobile too) that blooms deeper on hover.
  // Desktop-only in effect for the hover step: `hoverOnlyWhenSupported`
  // (tailwind config) keeps `group-hover:` off touch devices, so it never
  // sticks on a tap — leaving scroll/touch/click fluid on mobile.
  "shadow-[0_1px_2px_rgba(20,20,20,0.05),0_12px_26px_-18px_rgba(20,20,20,0.20)] " +
  "transition-shadow duration-500 ease-cinematic " +
  "group-hover:shadow-[0_26px_50px_-26px_rgba(20,20,20,0.32)]";

export function gridImageClass(
  category?: string | null,
  opts?: { fit?: "cover" | "contain"; transition?: string },
): string {
  // Silkier, slightly longer zoom on a cinematic curve — reads as a smooth,
  // deliberate close-up rather than a snap. Still transform-only (GPU-cheap)
  // and, via `hoverOnlyWhenSupported`, inert on touch so it can't affect
  // scrolling or taps on mobile.
  const transition = opts?.transition ?? "transition-transform duration-[600ms] ease-cinematic";

  // Lifestyle / cover crops already fill the frame — just the hover zoom.
  if (opts?.fit === "cover") {
    return `object-cover object-center ${transition} group-hover:scale-[1.08]`;
  }

  // Every grid cut-out is pre-normalized (offline) so its subject fills the
  // SAME fraction (0.90) of a square transparent canvas — see the asset
  // pipeline. That makes visual size uniform at the source, so the old
  // per-category scale hacks (which tried, and failed, to equalize photos with
  // wildly different built-in whitespace) are gone. One class fits all: a light
  // uniform base scale to sit comfortably in the 4:5 slot, plus the shared
  // hover zoom. `category` is kept in the signature for callers/compat.
  void category;
  return `object-contain object-center ${SHADOW} ${transition} p-2 scale-[1.04] group-hover:scale-[1.14]`;
}
