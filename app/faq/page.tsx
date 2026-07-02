import type { Metadata } from "next";
import { Plus } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "שאלות נפוצות — Oridor",
  description: "תשובות לשאלות הנפוצות ביותר על תכשיטי Oridor, המשלוחים, ההחזרות והטיפול בתכשיטים.",
};

const FAQS = [
  {
    q: "ממה עשויים התכשיטים של ORIDOR?",
    a: "כל התכשיטים שלנו מיוצרים מכסף 925 טהור ואיכותי בציפוי רודיום יוקרתי, המעניק להם ברק יוצא דופן ומגן עליהם מפני השחרה לאורך זמן. שיבוצי האבנים נעשים באבני מואסנייט מובחרות בדרגת ניקיון VVS1 וצבע D, המציעות נצנוץ מושלם שלא נופל מיהלום.",
  },
  {
    q: "האם יש אחריות על התכשיטים?",
    a: "בהחלט. אנו עומדים מאחורי איכות הייצור שלנו וכל תכשיט מגיע עם אחריות מלאה. האחריות מכסה פגמים בייצור ושיבוץ האבנים, כדי שתוכלי לענוד את התכשיט שלך בראש שקט לחלוטין.",
  },
  {
    q: "כיצד ניתן לדעת מה מידת הטבעת המתאימה לי?",
    a: "כדי למצוא את המידה המדויקת עבורך, אנו ממליצים להשתמש באפליקציות ייעודיות למדידת טבעות (כמו Ring Sizer) או פשוט למדוד קוטר פנימי של טבעת קיימת שיש ברשותך במילימטרים. אם את עדיין לא בטוחה, שירות הלקוחות שלנו ישמח לסייע לך.",
  },
  {
    q: "תוך כמה זמן מגיע המשלוח?",
    a: "אנו דואגים לארוז ולהוציא כל הזמנה במהירות המרבית. משלוחים עם שליח עד הבית מגיעים בדרך כלל תוך ימי עסקים ספורים לכל חלקי הארץ, וכל משלוח מלווה במספר מעקב שישלח אלייך ישירות למייל.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10 lg:py-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">כאן בשבילך</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          שאלות נפוצות
        </h1>
        <span className="mx-auto my-8 block h-px w-16 bg-gold" />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 sm:px-10">
        <div className="divide-y divide-platinum/40 border-y border-platinum/40">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-start text-sm font-normal text-charcoal transition-colors hover:text-gold [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus
                  size={16}
                  strokeWidth={1.5}
                  className="flex-none text-gold transition-transform duration-300 ease-cinematic group-open:rotate-45"
                />
              </summary>
              <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-graphite">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
