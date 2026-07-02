import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, text: "כסף 925 טהור מובטח" },
  { icon: Truck, text: "משלוח חינם עד הבית" },
  { icon: RotateCcw, text: "14 יום להחזרה" },
  { icon: Lock, text: "תשלום מאובטח" },
];

/**
 * Slim trust-signal strip — reassuring badges shown high on the homepage.
 */
export default function TrustStrip() {
  return (
    <section className="border-y border-platinum/40 bg-canvas">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-5 px-6 py-6 sm:grid-cols-4 sm:px-10 lg:px-16">
        {BADGES.map((b) => (
          <div key={b.text} className="flex items-center justify-center gap-2.5">
            <b.icon size={18} strokeWidth={1.5} className="flex-none text-gold" />
            <span className="text-xs font-light tracking-wide text-graphite">{b.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
