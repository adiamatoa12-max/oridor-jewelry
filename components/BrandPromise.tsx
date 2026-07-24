/**
 * Brand promise — an honest trust section for the homepage.
 *
 * Replaces the old testimonials block, whose reviews and "150+ ביקורות
 * מאומתות" rating were fabricated against a store with no orders. Until real
 * customer reviews exist, this states what the brand can actually stand behind:
 * the material, the shipping, the warranty and secure checkout. Purely
 * typographic (no icons), matching the site's editorial, high-end aesthetic.
 */

const PROMISES: { title: string; body: string }[] = [
  {
    title: "כסף סטרלינג 925",
    body: "כל תכשיט עשוי כסף 925 טהור בציפוי רודיום — עמיד, היפואלרגני ובעל ברק שנשאר.",
  },
  {
    title: "משלוח חינם",
    body: "משלוח מהיר עד הבית לכל ההזמנות, עם מספר מעקב מלא לאורך כל הדרך.",
  },
  {
    title: "אחריות ואותנטיות",
    body: "כל פריט מגיע עם תעודת אותנטיות ואחריות מלאה על העבודה והחומרים.",
  },
  {
    title: "רכישה מאובטחת",
    body: "התשלום מתבצע בסביבה מאובטחת ומוצפנת, ופרטי האשראי אינם נשמרים אצלנו.",
  },
];

export default function BrandPromise() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mb-12 text-center lg:mb-16">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">
          ההבטחה שלנו
        </p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          למה אורידור
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:gap-x-12 lg:grid-cols-4 lg:gap-x-14">
        {PROMISES.map((p) => (
          <div key={p.title} className="text-center">
            {/* Hairline rule above each value, an editorial device that keeps the
                row feeling composed without boxes or icons. */}
            <span className="mx-auto mb-5 block h-px w-8 bg-gold/50" aria-hidden="true" />
            <h3 className="text-sm font-medium tracking-[0.12em] text-charcoal">
              {p.title}
            </h3>
            <p className="mx-auto mt-3 max-w-[22ch] text-[13px] font-light leading-relaxed text-graphite">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
