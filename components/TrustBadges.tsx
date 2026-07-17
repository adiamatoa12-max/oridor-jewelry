import { Truck, ShieldCheck, Award } from "lucide-react";

// Point-of-conversion reassurance, shown directly under the Add-to-Cart button.
// Three concise promises with quiet gold icons — premium, never loud.
const BADGES = [
  { Icon: Truck, label: "משלוח מהיר", sub: "חינם עד הבית" },
  { Icon: ShieldCheck, label: "תשלום מאובטח", sub: "הצפנת SSL" },
  { Icon: Award, label: "אחריות מלאה", sub: "לכל תכשיט" },
];

/**
 * PDP trust badges — a three-up row (Fast Shipping · Secure Payment · Warranty)
 * with hairline dividers. Purely presentational; safe as a server component.
 */
export default function TrustBadges() {
  return (
    <div className="mt-6 grid grid-cols-3 divide-x divide-x-reverse divide-platinum/50 rounded-xl border border-platinum/50 bg-cream/30 py-4">
      {BADGES.map(({ Icon, label, sub }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 px-2 text-center"
        >
          <Icon size={20} strokeWidth={1.5} className="text-gold" />
          <span className="text-[11px] font-medium tracking-wide text-charcoal">
            {label}
          </span>
          <span className="text-[10px] font-light leading-tight text-ash">
            {sub}
          </span>
        </div>
      ))}
    </div>
  );
}
