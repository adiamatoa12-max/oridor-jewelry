import { ShieldCheck, Gem, Award, Sparkles } from "lucide-react";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "כסף 925 טהור",
    body: "כסף סטרלינג מלא לכל עומקו — ללא ציפויים מזויפים וללא תחליפים.",
  },
  {
    icon: Gem,
    title: "יהלומי מואסניט",
    body: "ברק יוצא דופן בדרגת D / VVS1 / מושלם, שמתחרה ביהלומים.",
  },
  {
    icon: Award,
    title: "עמידות לכל החיים",
    body: "ציפוי רודיום עמיד מפני שריטות ועמעום, לנצח.",
  },
  {
    icon: Sparkles,
    title: "עיצוב פרימיום",
    body: "עיצובים נקיים ועל-זמניים, בעבודת יד מדויקת.",
  },
];

/**
 * "האיכות של Oridor" — a value-driven strip of four core promises.
 * 4-column grid with gold icons; matches the site's premium, minimal aesthetic.
 */
export default function OridorQuality() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
      {/* Header */}
      <div className="mb-14 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">
          הסטנדרט של אורידור
        </p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          האיכות של Oridor
        </h2>
      </div>

      {/* 4-column value grid */}
      <div className="grid grid-cols-2 gap-px overflow-hidden border border-gray-200 bg-gray-200 md:grid-cols-4">
        {VALUES.map((v) => (
          <div
            key={v.title}
            className="flex flex-col items-center bg-canvas p-8 text-center lg:p-10"
          >
            <v.icon size={30} strokeWidth={1.1} className="text-gold" />
            <h3 className="mt-6 text-base font-normal tracking-wide text-charcoal">
              {v.title}
            </h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
              {v.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
