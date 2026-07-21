import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "תקנון האתר",
  description: "תקנון האתר ותנאי השימוש של Oridor: הזמנות ותשלומים, משלוחים, ביטולים והחזרות, שמירה על פרטיות המידע האישי שלך וזכויות הקניין הרוחני.",
};

const SECTIONS = [
  {
    title: "1. כללי",
    body: "ברוכה הבאה לאתר ORIDOR, חנות וירטואלית למכירת תכשיטי פרימיום. השימוש באתר, לרבות גלישה וביצוע רכישות, כפוף לתנאים המפורטים בתקנון זה, והרכישה באתר מהווה הסכמה להם. אנחנו מקפידים על סטנדרטים גבוהים כדי להעניק לך חוויית קנייה בטוחה ונעימה.",
  },
  {
    title: "2. הזמנות ותשלומים",
    body: "כל הזמנה באתר כפופה לאישור המלאי ולאישור חברת האשראי. התשלום מתבצע באופן מאובטח בהתאם לתקנים המחמירים, ופרטי האשראי אינם נשמרים במערכות שלנו. בסיום הרכישה יישלחו קבלה ואישור הזמנה לכתובת הדוא״ל שהוזנה בקופה.",
  },
  {
    title: "3. משלוחים",
    body: "אנחנו עושים כמיטב יכולתנו לארוז ולשלוח את התכשיטים במהירות האפשרית. זמני האספקה ומחירי המשלוח משתנים בהתאם לסוג המשלוח שנבחר בעת ביצוע ההזמנה (משלוח עד הבית או נקודת איסוף). עם יציאת המשלוח יישלח אלייך מספר מעקב.",
  },
  {
    title: "4. ביטולים והחזרות",
    body: "חשוב לנו שתהיי שלמה עם הבחירה שלך. ניתן לבטל עסקה ולהחזיר פריט תוך 14 ימים מיום קבלתו, ובלבד שהתכשיט מוחזר באריזתו המקורית, לא נעשה בו שימוש ולא נגרמו לו נזק או פגם. ההחזר הכספי יבוצע לאמצעי התשלום שבו בוצעה העסקה, בניכוי דמי ביטול כחוק.",
  },
  {
    title: "5. פרטיות ואבטחת מידע",
    body: "אנחנו מכבדים את פרטיותך ומתחייבים לשמור עליה. המידע האישי שנמסר בעת ביצוע ההזמנה משמש אך ורק לצורך עיבוד ההזמנה ומשלוח החבילה, ולא יועבר לצד שלישי ללא אישורך המפורש. האתר מאובטח לשמירה על פרטי התשלום שלך.",
  },
  {
    title: "6. קניין רוחני",
    body: "כל התוכן המופיע באתר, לרבות העיצובים, התמונות, הטקסטים והלוגו של ORIDOR, הוא רכושו הבלעדי של המותג. אין להעתיק, לשכפל, להפיץ או לעשות כל שימוש מסחרי בתוכן זה ללא אישור מראש ובכתב.",
  },
];

export default function TermsPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      {/* Title — centered */}
      <section className="mx-auto max-w-3xl px-6 pt-20 text-center sm:px-10 lg:pt-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">מדיניות ותנאים</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          תקנון האתר
        </h1>
        <span className="mx-auto mt-8 block h-px w-16 bg-gold" />
      </section>

      {/* Body — right-aligned, contained, dark and readable */}
      <div
        dir="rtl"
        className="mx-auto max-w-3xl px-6 py-16 text-right sm:px-10 lg:py-20"
      >
        <p className="text-lg font-light leading-relaxed text-graphite">
          אנא קראי בעיון את תנאי השימוש באתר Oridor. השימוש באתר ובשירותיו מהווה הסכמה לתנאים המפורטים להלן.
        </p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold tracking-wide text-charcoal">
                {s.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-graphite">
                {s.body}
              </p>
            </section>
          ))}
          <p className="border-t border-platinum/40 pt-8 text-sm font-light text-ash">
            עודכן לאחרונה: יולי 2026
          </p>
        </div>
      </div>

      <PremiumFooter />
    </main>
  );
}
