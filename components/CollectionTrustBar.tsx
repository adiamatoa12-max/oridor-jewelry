import { Gem, ShieldCheck, Sparkles } from "lucide-react";

interface TrustPoint {
  icon: typeof Gem;
  title: string;
  detail: string;
}

/**
 * The material story, shared by every collection: real sterling silver under a
 * rhodium plate. Stated in terms of what the piece IS — the comparison to
 * cheaper materials is left to the sub-headline, so the badges stay factual.
 */
const SILVER: TrustPoint = {
  icon: ShieldCheck,
  title: "כסף 925 + ציפוי רודיום",
  detail: "כסף סטרלינג אמיתי לכל עומקו, בציפוי רודיום שמגן מפני החמרה והשחרה.",
};

const QUALITY: TrustPoint = {
  icon: Sparkles,
  title: "איכות ללא פשרות",
  detail: "כל פריט נבדק ידנית ומגיע עם תעודת אותנטיות ואחריות מלאה.",
};

/**
 * Stone credentials — only meaningful on collections whose pieces are actually
 * set with moissanite. Kept out of the shared defaults so it can never be
 * claimed on a plain-silver collection page.
 */
const MOISSANITE: TrustPoint = {
  icon: Gem,
  title: "מואסנייט D / VVS1",
  detail: "אבן בדרגת הצבע והניקיון הגבוהה ביותר, בליטוש Excellent Cut.",
};

/**
 * Minimal three-point trust bar, sits directly beneath a collection header.
 *
 * `variant` picks the middle point: "moissanite" collections state the stone
 * grade; everything else states the hypoallergenic property instead, since a
 * stone claim would be false on a plain-silver page.
 */
export default function CollectionTrustBar({
  variant = "silver",
  className = "",
}: {
  variant?: "silver" | "moissanite";
  className?: string;
}) {
  const middle: TrustPoint =
    variant === "moissanite"
      ? MOISSANITE
      : {
          icon: Gem,
          title: "היפואלרגני ונוח",
          detail: "ציפוי הרודיום נטול ניקל — עדין על העור, גם בענידה יומיומית.",
        };

  const points = [SILVER, middle, QUALITY];

  return (
    <ul
      className={`grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-platinum/30 ring-1 ring-platinum/40 sm:grid-cols-3 ${className}`}
    >
      {points.map(({ icon: Icon, title, detail }) => (
        <li
          key={title}
          className="flex flex-col items-center gap-2.5 bg-cream px-6 py-7 text-center"
        >
          <Icon size={20} strokeWidth={1.25} className="text-gold" aria-hidden="true" />
          <p className="text-[13px] font-medium tracking-[0.06em] text-charcoal">
            {title}
          </p>
          <p className="max-w-[28ch] text-xs font-light leading-relaxed text-graphite">
            {detail}
          </p>
        </li>
      ))}
    </ul>
  );
}
