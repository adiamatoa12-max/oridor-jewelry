/**
 * Ring size guide (מדריך מידות טבעת).
 * A minimalist, luxury-themed explainer: a 3-step measuring method plus a clean
 * conversion table (standard sizes → inner diameter & circumference in mm).
 * Deep charcoal / platinum palette, generous whitespace, RTL-native.
 * Self-contained section — drop it into any page.
 */

const STEPS = [
  {
    n: "01",
    title: "מדדו טבעת קיימת",
    body: "קחו טבעת שכבר מתאימה לכן בדיוק. הניחו אותה על סרגל ומדדו את הקוטר הפנימי — מקצה פנימי אחד לשני — במילימטרים.",
  },
  {
    n: "02",
    title: "או מדדו את האצבע",
    body: "כרכו רצועת נייר דקה או חוט סביב בסיס האצבע. סמנו את הנקודה שבה הקצה נפגש, פתחו והניחו לצד סרגל — זהו ההיקף במ״מ.",
  },
  {
    n: "03",
    title: "מצאו את המידה",
    body: "השוו את הקוטר או ההיקף שמדדתם לטבלה שלמטה ובחרו את המידה הקרובה ביותר. אם יצא לכן בין שתי מידות — עדיף לעגל כלפי מעלה.",
  },
];

// Standard ring sizes → inner diameter & circumference (mm). circ = diameter × π.
const SIZE_CHART = [
  { size: "5", dia: "15.7", circ: "49.3" },
  { size: "6", dia: "16.5", circ: "51.8" },
  { size: "7", dia: "17.3", circ: "54.4" },
  { size: "8", dia: "18.1", circ: "56.9" },
  { size: "9", dia: "18.9", circ: "59.4" },
  { size: "10", dia: "19.8", circ: "62.2" },
];

export default function RingSizeGuide() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-right sm:px-10 lg:px-16 lg:py-28">
      {/* Intro */}
      <header className="text-center">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">מדריך מידות</p>
        <h2 className="text-3xl font-light leading-relaxed tracking-wide text-charcoal lg:text-4xl">
          מדריך מידות טבעת
        </h2>
        <span className="mx-auto my-8 block h-px w-16 bg-gold" />
        <p className="mx-auto max-w-xl text-sm font-light leading-loose text-graphite">
          מציאת המידה המדויקת פשוטה ולוקחת פחות מדקה. כל מה שצריך הוא טבעת קיימת,
          או רצועת נייר וסרגל.
        </p>
      </header>

      {/* Steps — clean hairline grid */}
      <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-platinum/50 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="bg-canvas p-10 text-center">
            <p className="font-serif text-2xl font-light text-gold">{s.n}</p>
            <h3 className="mt-5 text-base font-normal tracking-wide text-charcoal">
              {s.title}
            </h3>
            <p className="mt-3 text-sm font-light leading-loose text-graphite">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      {/* Conversion table — minimalist, charcoal header, airy rows */}
      <div className="mt-20">
        <h3 className="mb-8 text-center text-2xl font-light tracking-wide text-charcoal">
          טבלת המרת מידות
        </h3>
        <div className="overflow-hidden rounded-sm border border-platinum/50">
          <table className="w-full text-center text-sm">
            <thead>
              <tr className="bg-charcoal text-[11px] uppercase tracking-[0.2em] text-canvas">
                <th className="px-4 py-5 font-light">מידה</th>
                <th className="px-4 py-5 font-light">קוטר פנימי (מ״מ)</th>
                <th className="px-4 py-5 font-light">היקף (מ״מ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-platinum/40">
              {SIZE_CHART.map((r) => (
                <tr
                  key={r.size}
                  className="bg-canvas transition-colors duration-200 hover:bg-pearl"
                >
                  <td className="px-4 py-5 text-base font-normal tracking-wide text-charcoal">
                    {r.size}
                  </td>
                  <td className="px-4 py-5 font-light tabular-nums text-graphite">
                    {r.dia}
                  </td>
                  <td className="px-4 py-5 font-light tabular-nums text-graphite">
                    {r.circ}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 text-center text-xs font-light leading-relaxed text-ash">
          עדיין מתלבטות? צרו איתנו קשר בוואטסאפ ונשמח לעזור לכן למצוא את המידה
          המושלמת.
        </p>
      </div>
    </section>
  );
}
