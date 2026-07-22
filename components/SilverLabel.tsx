import { SUBTITLE_CLASS } from "./MoissaniteLabel";

/**
 * "כסף 925 + ציפוי רודיום" — the material callout shown under the title of
 * non-moissanite pieces, mirroring MoissaniteLabel for products that aren't
 * stone-set. Shares MoissaniteLabel's exact style via SUBTITLE_CLASS so the two
 * subtitles are visually identical and stay in sync.
 */
export default function SilverLabel({
  className = "",
}: {
  className?: string;
}) {
  return <p className={`${SUBTITLE_CLASS} ${className}`}>כסף 925 + ציפוי רודיום</p>;
}
