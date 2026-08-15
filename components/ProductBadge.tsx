import { Star, Sparkles } from "lucide-react";
import type { ProductBadge as Badge } from "@/lib/badges";

/**
 * Small, elegant badge pill overlaid on the top-start of a product card image.
 * Best Seller = a gold filled star; New = a gold sparkle. Translucent cream
 * surface with a hairline ring so it reads as premium, not a loud sticker.
 * `pointer-events-none` so it never blocks a tap on the card.
 */
export default function ProductBadge({ badge }: { badge: Badge }) {
  const isBest = badge.kind === "bestseller";
  const Icon = isBest ? Star : Sparkles;
  return (
    <span className="pointer-events-none absolute start-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-canvas/90 px-2.5 py-1 text-[10px] font-medium tracking-[0.06em] text-charcoal shadow-[0_2px_10px_-3px_rgba(26,26,26,0.35)] ring-1 ring-platinum/50 backdrop-blur-sm">
      <Icon size={11} strokeWidth={2} className={isBest ? "fill-gold text-gold" : "text-gold"} />
      {badge.label}
    </span>
  );
}
