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
 * Boutique treatment (Mondo-style): a soft, uniform LIGHT-GREY fill with NO
 * border and no base shadow, so the tile frames the jewellery cleanly and
 * seamlessly instead of boxing it in white/cream with outlines. Minimalist and
 * borderless; only a whisper of shadow blooms on hover for a subtle lift. The
 * `rounded-2xl overflow-hidden` frame still crops any full-bleed lifestyle
 * (cover) shot into a clean rounded photo. Pair with
 * `relative aspect-[4/5] w-full overflow-hidden`, on a card whose outer element
 * carries `group`.
 */
export const GRID_CARD =
  "rounded-2xl bg-[#F1F1EF] " +
  "transition-shadow duration-500 ease-out " +
  "group-hover:shadow-[0_16px_36px_-24px_rgba(20,20,20,0.2)]";

export function gridImageClass(
  category?: string | null,
  opts?: { fit?: "cover" | "contain"; transition?: string },
): string {
  const transition = opts?.transition ?? "transition-transform duration-500 ease-out";

  // Lifestyle / cover crops already fill the frame — just the hover zoom.
  if (opts?.fit === "cover") {
    return `object-cover object-center ${transition} group-hover:scale-105`;
  }

  const common = `object-contain object-center ${SHADOW} ${transition}`;
  switch (category) {
    case "Necklaces":
      // Long/delicate — already near-full at this zoom. Left as-is: pushing it
      // harder would clip tall necklaces (object-contain + scale can overflow
      // the frame, which overflow-hidden then crops).
      return `${common} p-1 scale-[1.3] group-hover:scale-[1.45]`;
    case "Bracelets":
      // Horizontal lines — a firmer zoom so they fill the card like the rest.
      return `${common} p-2 scale-[1.2] group-hover:scale-[1.3]`;
    default:
      // Rings, earrings — these read smallest, floating in whitespace. Tighter
      // padding plus a base zoom fills the card so the stone detail stands out.
      return `${common} p-2.5 scale-[1.12] group-hover:scale-[1.2]`;
  }
}
