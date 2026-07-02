import type { Metadata } from "next";
import { Truck } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "משלוחים והחזרות",
  description:
    "מדיניות המשלוחים וההחזרות של Oridor — משלוח מהיר עד הבית בחינם לכל ההזמנות, עם מעקב מלא.",
};

const RETURNS = [
  {
    title: "החזרות",
    body: "ניתן להחזיר פריטים תוך 14 ימים מיום קבלת המשלוח, כשהם באריזתם המקורית, ללא נזק ושלא נעשה בהם כל שימוש.",
  },
  {
    title: "החלפות",
    body: "מעוניינים להחליף למידה אחרת או לתכשיט שונה? צרו איתנו קשר ונשמח לעזור.",
  },
  {
    title: "החזר כספי",
    body: 'ההחזר יבוצע לאמצעי התשלום המקורי לאחר קבלת התכשיט אצלנו ובדיקתו, בהתאם לחוק הגנת הצרכן (בניכוי 5% או 100 ש"ח, הנמוך מביניהם).',
  },
  {
    title: "חריגים",
    body: "מטעמי היגיינה, לא ניתן להחזיר או להחליף עגילים מכל סוג שהוא.",
  },
];

export default function ShippingPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10 lg:py-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">שירות ללא פשרות</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          משלוחים והחזרות
        </h1>
        <span className="mx-auto my-8 block h-px w-16 bg-gold" />
        <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-graphite">
          אנו יודעים כמה את מחכה לתכשיט החדש שלך, ולכן אנו עושים הכל כדי שיגיע
          אלייך במהירות ובבטחה.
        </p>
      </section>

      {/* Processing & tracking */}
      <section className="mx-auto max-w-3xl px-6 sm:px-10">
        <h2 className="text-lg font-normal tracking-wide text-charcoal">
          זמן עיבוד ומעקב
        </h2>
        <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
          זמן עיבוד והכנת ההזמנה אורך בדרך כלל בין 1-2 ימי עסקים. ברגע שהחבילה
          שלך תצא לדרך, נשלח אליך מספר מעקב במייל או ב-SMS כדי שתוכלו לעקוב אחריה.
        </p>
      </section>

      {/* Shipping option — single free home delivery */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:py-20">
        <h2 className="mb-8 text-center text-lg font-normal tracking-wide text-charcoal">
          אפשרויות המשלוח שלנו
        </h2>
        <div className="mx-auto max-w-md">
          <div className="flex flex-col items-center rounded-sm border border-platinum/40 bg-cream/40 p-10 text-center">
            <Truck size={26} strokeWidth={1.25} className="text-gold" />
            <h3 className="mt-5 text-lg font-light tracking-wide text-charcoal">
              משלוח מהיר עד הבית בחינם
            </h3>
            <p className="mt-2 text-xs tracking-[0.2em] text-gold">3-5 ימי עסקים</p>
            <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
              המשלוח בחינם לכל ההזמנות!
            </p>
          </div>
        </div>
      </section>

      {/* Returns & exchanges policy */}
      <section className="mx-auto max-w-3xl px-6 pb-24 sm:px-10">
        <h2 className="text-lg font-normal tracking-wide text-charcoal">
          מדיניות החזרות והחלפות
        </h2>
        <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
          אנו מאמינים באיכות התכשיטים שלנו ורוצים שתהיו שלמים 100% עם הרכישה
          שלכם.
        </p>
        <div className="mt-8 space-y-6">
          {RETURNS.map((r) => (
            <div key={r.title}>
              <h3 className="text-sm font-medium tracking-wide text-charcoal">
                {r.title}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-graphite">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
