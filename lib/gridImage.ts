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
 * Boutique treatment: fully BORDERLESS and SEAMLESS — no fill, no grey box, no
 * border. Each transparent cut-out sits clean and spacious directly on the page
 * (or the grey product zone) so the jewellery is the whole focus; only a whisper
 * of shadow blooms on hover for a subtle lift. The `rounded-2xl overflow-hidden`
 * frame still crops any full-bleed lifestyle (cover) shot into a clean rounded
 * photo. Pair with `relative aspect-[4/5] w-full overflow-hidden`, on a card
 * whose outer element carries `group`.
 */
export const GRID_CARD =
  "rounded-2xl bg-transparent " +
  // Silky, cinematic easing + a soft, diffused shadow that blooms on hover.
  // Desktop-only in effect: `hoverOnlyWhenSupported` (tailwind config) keeps
  // `group-hover:` off touch devices, so this never fires — and never sticks —
  // on a tap, leaving scroll/touch/click completely fluid on mobile.
  "transition-shadow duration-500 ease-cinematic " +
  "group-hover:shadow-[0_26px_50px_-26px_rgba(20,20,20,0.30)]";

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
