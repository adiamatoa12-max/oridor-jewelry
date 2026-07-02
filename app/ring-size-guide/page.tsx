import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "מדריך מידות טבעת",
  description:
    "מדריך פשוט למדידת היקף האצבע בבית ומציאת מידת הטבעת המדויקת שלך.",
};

const STEPS = [
  {
    n: "01",
    title: "מדדו את היקף האצבע",
    body: "כרכו חוט דק או רצועת נייר סביב בסיס האצבע שעליה תרצו לענוד את הטבעת. סמנו את הנקודה שבה הקצה פוגש את החוט.",
  },
  {
    n: "02",
    title: "מדדו במ״מ",
    body: "פתחו את החוט והניחו אותו לצד סרגל. ההיקף שמדדתם (במילימטרים) הוא המספר שיוביל אתכן למידה המדויקת בטבלה למטה.",
  },
  {
    n: "03",
    title: "מדדו טבעת קיימת",
    body: "לחלופין, קחו טבעת שכבר מתאימה לכן ומדדו את הקוטר הפנימי שלה במ״מ. השוו אותו לטור ‘קוטר’ בטבלה.",
  },
];

// Circumference (mm) → Israeli/EU ring size, with inner diameter.
const SIZE_CHART = [
  { size: "6", circ: "46.8", dia: "14.9" },
  { size: "7", circ: "47.8", dia: "15.2" },
  { size: "8", circ: "48.7", dia: "15.5" },
  { size: "9", circ: "49.8", dia: "15.8" },
  { size: "10", circ: "51.5", dia: "16.4" },
  { size: "11", circ: "52.5", dia: "16.7" },
  { size: "12", circ: "54.4", dia: "17.3" },
  { size: "13", circ: "55.7", dia: "17.7" },
  { size: "14", circ: "57.0", dia: "18.1" },
  { size: "15", circ: "58.9", dia: "18.8" },
];

export default function RingSizeGuidePage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        {/* Intro */}
        <header className="text-center">
          <p className="mb-4 text-xs tracking-[0.25em] text-gold">
            מדריך מידות
          </p>
          <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
            מדריך מידות טבעת
          </h1>
          <span className="mx-auto my-8 block h-px w-16 bg-gold" />
          <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-graphite">
            מציאת המידה המדויקת היא פשוטה ולוקחת פחות מדקה. כל מה שצריך הוא חוט או
            רצועת נייר, סרגל — וכמה רגעים.
          </p>
        </header>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-gray-200 bg-gray-200 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-canvas p-10 text-center">
              <p className="font-serif text-2xl text-gold">{s.n}</p>
              <h2 className="mt-4 text-base font-normal tracking-wide text-charcoal">
                {s.title}
              </h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* Size chart */}
        <div className="mt-16">
          <h2 className="mb-6 text-center text-2xl font-light tracking-wide text-charcoal">
            טבלת מידות
          </h2>
          <div className="overflow-hidden border border-gray-200">
            <table className="w-full text-center text-sm">
              <thead>
                <tr className="bg-[#F8F8F8] text-xs uppercase tracking-[0.15em] text-ash">
                  <th className="px-4 py-4 font-normal">מידה</th>
                  <th className="px-4 py-4 font-normal">היקף (מ״מ)</th>
                  <th className="px-4 py-4 font-normal">קוטר (מ״מ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-light text-graphite">
                {SIZE_CHART.map((r) => (
                  <tr key={r.size}>
                    <td className="px-4 py-3 font-normal text-charcoal">{r.size}</td>
                    <td className="px-4 py-3">{r.circ}</td>
                    <td className="px-4 py-3">{r.dia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-center text-xs font-light text-ash">
            עדיין מתלבטות? צרו איתנו קשר בוואטסאפ ונשמח לעזור לכן למצוא את המידה
            המושלמת.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link href="/collection/moissanite" className="btn-ghost">
            חזרה לקולקציה
          </Link>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
