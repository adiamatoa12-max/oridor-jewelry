import type { Metadata } from "next";
import { Plus } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "שאלות נפוצות",
  description: "תשובות לשאלות הנפוצות על תכשיטי Oridor: החומרים והאבנים, מידות הטבעת, זמני המשלוח, מדיניות ההחזרות והטיפול הנכון בתכשיט שלך.",
};

const FAQS = [
  {
    q: "ממה עשויים התכשיטים של ORIDOR?",
    a: "כל התכשיטים שלנו מיוצרים מכסף 925 טהור בציפוי רודיום, המעניק להם ברק יוצא דופן ושומר עליהם מפני השחרה לאורך זמן. השיבוץ נעשה באבני מואסנייט מובחרות בדרגת ניקיון VVS1 וצבע D, שהברק שלהן אינו נופל מזה של יהלום.",
  },
  {
    q: "האם יש אחריות על התכשיטים?",
    a: "כן. אנחנו עומדים מאחורי איכות הייצור שלנו, וכל תכשיט מגיע עם אחריות מלאה. האחריות מכסה פגמי ייצור ושיבוץ אבנים, כדי שתוכלי לענוד את התכשיט שלך בראש שקט.",
  },
  {
    q: "כיצד ניתן לדעת מה מידת הטבעת המתאימה לי?",
    a: "כדי למצוא את המידה המדויקת שלך, אפשר להיעזר באפליקציה למדידת טבעות (כמו Ring Sizer), או פשוט למדוד במילימטרים את הקוטר הפנימי של טבעת שכבר יש ברשותך. אם נותר ספק, שירות הלקוחות שלנו ישמח לסייע.",
  },
  {
    q: "תוך כמה זמן מגיע המשלוח?",
    a: "אנחנו אורזים ושולחים כל הזמנה במהירות האפשרית. משלוח עם שליח עד הבית מגיע בדרך כלל תוך ימי עסקים ספורים לכל חלקי הארץ, וכל משלוח מלווה במספר מעקב שנשלח אלייך ישירות למייל.",
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
