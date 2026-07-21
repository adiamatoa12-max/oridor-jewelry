import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "משלוחים והחזרות",
  description:
    "מדיניות המשלוחים וההחזרות של Oridor: משלוח מהיר עד הבית, חינם לכל ההזמנות, עם מספר מעקב מלא והחזרה תוך 14 ימים מיום הקבלה.",
};

const RETURNS = [
  {
    title: "החזרות",
    body: "ניתן להחזיר פריטים תוך 14 ימים מיום קבלת המשלוח, כשהם באריזתם המקורית, ללא נזק ושלא נעשה בהם כל שימוש.",
  },
  {
    title: "החלפות",
    body: "מעוניינת להחליף למידה אחרת או לתכשיט אחר? צרי איתנו קשר ונשמח לעזור.",
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

      {/* Title — centered */}
      <section className="mx-auto max-w-3xl px-6 pt-20 text-center sm:px-10 lg:pt-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">שירות ללא פשרות</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          משלוחים והחזרות
        </h1>
        <span className="mx-auto mt-8 block h-px w-16 bg-gold" />
      </section>

      {/* Body — right-aligned, contained, dark and readable */}
      <div
        dir="rtl"
        className="mx-auto max-w-3xl space-y-14 px-6 py-16 text-right sm:px-10 lg:py-20"
      >
        <p className="text-lg font-light leading-relaxed text-graphite">
          אנחנו יודעים כמה את מחכה לתכשיט החדש שלך, ולכן עושים הכל כדי שיגיע אלייך במהירות ובבטחה.
        </p>

        {/* Processing & tracking */}
        <section>
          <h2 className="text-xl font-semibold tracking-wide text-charcoal">
            זמן עיבוד ומעקב
          </h2>
          <p className="mt-4 text-base leading-relaxed text-graphite">
            עיבוד ההזמנה והכנתה אורכים בדרך כלל יום עד יומיים עסקים. ברגע שהחבילה שלך יוצאת לדרך, נשלח אלייך מספר מעקב במייל או ב-SMS כדי שתוכלי לעקוב אחריה.
          </p>
        </section>

        {/* Shipping option */}
        <section>
          <h2 className="text-xl font-semibold tracking-wide text-charcoal">
            אפשרויות המשלוח שלנו
          </h2>
          <div className="mt-4 space-y-1.5">
            <p className="text-base font-semibold text-charcoal">
              משלוח מהיר עד הבית בחינם
            </p>
            <p className="text-base leading-relaxed text-graphite">
              3 עד 5 ימי עסקים. המשלוח בחינם לכל ההזמנות.
            </p>
          </div>
        </section>

        {/* Returns & exchanges policy */}
        <section>
          <h2 className="text-xl font-semibold tracking-wide text-charcoal">
            מדיניות החזרות והחלפות
          </h2>
          <p className="mt-4 text-base leading-relaxed text-graphite">
            אנחנו מאמינים באיכות התכשיטים שלנו, ורוצים שתהיי שלמה לגמרי עם הרכישה שלך.
          </p>

          <div className="mt-8 space-y-6">
            {RETURNS.map((r) => (
              <div key={r.title}>
                <h3 className="text-base font-semibold text-charcoal">
                  {r.title}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed text-graphite">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <PremiumFooter />
    </main>
  );
}
