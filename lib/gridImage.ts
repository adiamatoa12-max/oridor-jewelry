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
// The jewellery's own soft, diffuse drop shadow — it follows the piece's
// SILHOUETTE (not a box), so a transparent cut-out reads as gently floating on
// the page background. Two chained drop-shadows: a soft close one for a hint of
// grounding, and a wider, very diffuse one for airy ambient depth. Kept subtle
// on purpose. Contained shots only; cover (lifestyle) crops fill the frame.
const SHADOW =
  "[filter:drop-shadow(0px_5px_8px_rgba(0,0,0,0.06))_drop-shadow(0px_20px_34px_rgba(0,0,0,0.11))]";

/**
 * The product-image container, shared by every grid so cards look identical
 * across collections.
 *
 * Boutique treatment: fully BORDERLESS and SEAMLESS — no fill, no box, no
 * border, no rectangular shadow. Each transparent cut-out sits directly on the
 * page and appears to softly float via its own silhouette drop shadow (see
 * SHADOW above), so nothing frames the jewellery. The `rounded-2xl
 * overflow-hidden` frame is still there only to crop any full-bleed lifestyle
 * (cover) shot into a clean rounded photo. Pair with
 * `relative aspect-[4/5] w-full overflow-hidden`.
 */
export const GRID_CARD = "rounded-2xl bg-transparent";

/**
 * Image treatment for live Shopify STUDIO photos (shot on a white background).
 * `mix-blend-multiply` melts the photo's white ground into the page/section
 * background, so the piece appears to sit transparently on the page — the
 * high-end "floating jewellery" look — without any card box, border or fill.
 * `object-contain` shows the whole piece; a gentle hover zoom, no rectangular
 * shadow (the white is blended away, so there's no box to shadow).
 */
export const LIVE_IMAGE =
  "object-contain object-center mix-blend-multiply p-3 " +
  "transition-transform duration-[600ms] ease-cinematic group-hover:scale-[1.05]";

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
