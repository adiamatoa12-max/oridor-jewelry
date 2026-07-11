import { ShieldCheck, BadgeCheck, Truck, RotateCcw } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, title: "כסף 925 טהור", sub: "בציפוי רודיום עמיד" },
  { icon: BadgeCheck, title: "אחריות מלאה", sub: "ותעודת אותנטיות" },
  { icon: Truck, title: "משלוח חינם", sub: "לכל ההזמנות" },
  { icon: RotateCcw, title: "החזרות עד 14 יום", sub: "בראש שקט מלא" },
];

/**
 * Trust badges — a clean, minimal row of small icons with subtle text below.
 * No boxes or fills; separated only by thin hairlines so it reads as a quiet,
 * premium reassurance strip rather than a cluttered grid.
 */
export default function TrustBadges() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-y-6 border-y border-platinum/50 py-6 sm:grid-cols-4 sm:divide-x sm:divide-platinum/50 sm:rtl:divide-x-reverse">
      {BADGES.map((b) => (
        <div key={b.title} className="flex flex-col items-center px-2 text-center">
          <b.icon size={20} strokeWidth={1.5} className="text-gold" />
          <p className="mt-2 text-[11px] font-medium tracking-wide text-charcoal">{b.title}</p>
          <p className="mt-0.5 text-[10px] font-light leading-tight text-ash">{b.sub}</p>
        </div>
      ))}
    </div>
  );
}
