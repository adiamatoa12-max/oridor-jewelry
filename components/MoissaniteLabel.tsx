/**
 * Shared style for the small gold subtitle under a product title. Exported so
 * the sibling material subtitles (SilverLabel) render byte-identically and can
 * never drift apart — small, light, gold, widely tracked, so it reads as a
 * refinement of the title rather than a badge competing with it.
 */
export const SUBTITLE_CLASS =
  "text-[10px] font-light leading-none tracking-[0.16em] text-gold";

/**
 * "משובץ מואסנייט" — the stone callout shown under a product title in the
 * grids, so shoppers can tell at a glance what a piece is set with.
 *
 * Deliberately one shared component rather than repeated markup: it appears in
 * both MoissaniteGrid and ProductCard, and the two must not drift apart.
 */
export default function MoissaniteLabel({
  className = "",
}: {
  className?: string;
}) {
  return <p className={`${SUBTITLE_CLASS} ${className}`}>משובץ מואסנייט</p>;
}
