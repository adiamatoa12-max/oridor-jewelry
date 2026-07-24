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
const SHADOW = "[filter:drop-shadow(0px_6px_14px_rgba(0,0,0,0.07))]";

/**
 * The product-image CARD surface, shared by every grid so cards look identical
 * across collections. A crisp white (canvas) tile lifted off the warm off-white
 * page by a hairline platinum ring and a soft shadow, so the jewellery reads as
 * a distinct object instead of blending into the background. Rounded to match
 * the PDP frame. Pair with `relative aspect-[4/5] w-full overflow-hidden`.
 */
export const GRID_CARD =
  "rounded-xl bg-canvas ring-1 ring-platinum/50 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-14px_rgba(0,0,0,0.16)]";

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
