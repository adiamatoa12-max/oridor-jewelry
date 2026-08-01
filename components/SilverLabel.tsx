import { SUBTITLE_CLASS } from "./MoissaniteLabel";

/**
 * "בציפוי רודיום" — the concise material callout shown under the title of
 * non-moissanite (silver) pieces, mirroring MoissaniteLabel's "משובץ מואסנייט".
 * Shares MoissaniteLabel's exact style via SUBTITLE_CLASS so the two subtitles
 * are visually identical (size, gold tone, spacing) and stay in sync.
 */
export default function SilverLabel({
  className = "",
}: {
  className?: string;
}) {
  return <p className={`${SUBTITLE_CLASS} ${className}`}>בציפוי רודיום</p>;
}
