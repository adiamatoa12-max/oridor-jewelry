interface TrustPoint {
  title: string;
  detail: string;
}

/**
 * The material story, shared by every collection: real sterling silver under a
 * rhodium plate. Stated in terms of what the piece IS — the comparison to
 * cheaper materials is left to the sub-headline, so the points stay factual.
 */
const SILVER: TrustPoint = {
  title: "כסף 925 בציפוי רודיום",
  detail: "כסף סטרלינג אמיתי לכל עומקו, בציפוי רודיום שמגן מפני התחמצנות והשחרה.",
};

const QUALITY: TrustPoint = {
  title: "איכות ללא פשרות",
  detail: "כל פריט נבדק ידנית ומגיע עם תעודת אותנטיות ואחריות מלאה.",
};

/**
 * Stone credentials — only meaningful on collections whose pieces are actually
 * set with moissanite. Kept out of the shared defaults so it can never be
 * claimed on a plain-silver collection page.
 */
const MOISSANITE: TrustPoint = {
  title: "מואסנייט D / VVS1",
  detail: "אבן בדרגת הצבע והניקיון הגבוהה ביותר, בליטוש Excellent Cut.",
};

/**
 * Purely typographic value-proposition band, sitting beneath a collection
 * header. No icons, rules, or surfaces: hierarchy comes from weight, scale and
 * tracking, and separation comes from whitespace alone.
 *
 * Start-aligned rather than centred. Three centred blocks each form their own
 * ragged silhouette, whereas start-alignment gives the row a single shared
 * vertical axis — the alignment discipline that reads as editorial.
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
          title: "היפואלרגני ונוח",
          detail: "ציפוי הרודיום נטול ניקל, עדין על העור גם בענידה יומיומית.",
        };

  const points = [SILVER, middle, QUALITY];

  return (
    <ul
      className={`grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-14 sm:gap-y-0 lg:gap-x-24 ${className}`}
    >
      {points.map(({ title, detail }) => (
        <li key={title} className="text-start">
          {/*
            Label scale: small, wide-tracked, and set in the body weight rather
            than a bold one. Hebrew has no uppercase, so the tracking is what
            carries the "small caps" signal that this register relies on.
          */}
          <p className="text-[11px] font-normal leading-none tracking-[0.2em] text-charcoal">
            {title}
          </p>
          {/*
            The detail line is deliberately LARGER than its label. Inverting the
            usual heading/body relationship is the editorial move: the label
            recedes into a quiet marker and the sentence becomes the object worth
            reading. Loose leading and a ~34ch measure keep it calm.
          */}
          <p className="mt-5 max-w-[34ch] text-[13.5px] font-light leading-[2] text-graphite">
            {detail}
          </p>
        </li>
      ))}
    </ul>
  );
}
