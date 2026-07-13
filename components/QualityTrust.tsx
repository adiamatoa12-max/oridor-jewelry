import { ScrollText, ShieldCheck, Gem } from "lucide-react";

const ITEMS = [
  {
    icon: ScrollText,
    title: "תעודת GRA",
    sub: "אבן מואסניט מקורית ומאומתת",
  },
  {
    icon: ShieldCheck,
    title: "אחריות לכל החיים",
    sub: "כיסוי מלא על כל תכשיט",
  },
  {
    icon: Gem,
    title: "כסף 925 + רודיום",
    sub: "עמיד ואנטי-החלדה",
  },
];

/**
 * Premium quality-trust strip — three minimalist assurances shown directly
 * under the Add-to-Cart button, where buyers seek confidence before purchase.
 * GRA authenticity · lifetime warranty · precious-material quality.
 *
 * Deliberately borderless and quiet (only a thin top hairline) so it reads as
 * refined reassurance, not a busy badge grid — and so it sits distinctly above
 * the logistics strip (shipping/returns) that follows it.
 */
export default function QualityTrust() {
  return (
    <div className="mt-9 grid grid-cols-3 gap-x-3 border-t border-platinum/50 pb-1 pt-8">
      {ITEMS.map((item) => (
        <div key={item.title} className="flex flex-col items-center px-1 text-center">
          <item.icon size={22} strokeWidth={1.25} className="text-gold" />
          <p className="mt-2.5 font-sans text-[12px] font-medium tracking-wide text-charcoal">
            {item.title}
          </p>
          <p className="mt-1 font-sans text-[10.5px] font-light leading-tight text-ash">
            {item.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
