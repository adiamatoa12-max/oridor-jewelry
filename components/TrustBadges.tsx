import { ShieldCheck, BadgeCheck, Truck, RotateCcw } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, title: "כסף 925 טהור", sub: "בציפוי רודיום עמיד" },
  { icon: BadgeCheck, title: "אחריות מלאה", sub: "ותעודת אותנטיות" },
  { icon: Truck, title: "משלוח חינם", sub: "לכל ההזמנות" },
  { icon: RotateCcw, title: "החזרות עד 14 יום", sub: "בראש שקט מלא" },
];

/**
 * Trust badges — a clean, reassuring row shown on product pages.
 */
export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-platinum/40 bg-platinum/40 sm:grid-cols-4">
      {BADGES.map((b) => (
        <div key={b.title} className="flex flex-col items-center bg-canvas px-3 py-5 text-center">
          <b.icon size={22} strokeWidth={1.25} className="text-gold" />
          <p className="mt-2.5 text-xs font-medium tracking-wide text-charcoal">{b.title}</p>
          <p className="mt-0.5 text-[11px] font-light text-ash">{b.sub}</p>
        </div>
      ))}
    </div>
  );
}
