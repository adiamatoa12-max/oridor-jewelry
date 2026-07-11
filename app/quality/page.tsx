import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Gem, Sparkles, BadgeCheck, Award } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "איכות ואותנטיות",
  description:
    "מחויבות Oridor לאיכות: כסף סטרלינג 925 מלא, מואסניט בדרגת D / VVS1 / מושלם, ועבודת יד עמידה לכל החיים.",
};

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "כסף סטרלינג 925 מלא",
    body: "כל תכשיט נוצר מכסף סטרלינג 925 טהור לכל עומקו — ללא ציפויים מזויפים וללא תחליפים. מה שאתן רואות הוא בדיוק מה שאתן מקבלות: מתכת יקרה אמיתית שנשארת יפה לאורך שנים.",
  },
  {
    icon: Gem,
    title: "מואסניט ברמה הגבוהה ביותר",
    body: "אנו בוחרים אך ורק אבני מואסניט מובחרות — צבע D (לבן צח לחלוטין), ניקיון VVS1 וליטוש מושלם. התוצאה: ברק יוצא דופן ואש שמתחרה ביהלומים, בכל תאורה.",
  },
  {
    icon: Sparkles,
    title: "נוצר לעמידות ולאריכות ימים",
    body: "כל פריט עובר עבודת יד מדויקת וגימור קפדני, ומצופה רודיום להגנה מרבית מפני שריטות ועמעום. תכשיט על-זמני שנועד ללוות אתכן יום-יום, לשנים רבות.",
  },
  {
    icon: Award,
    title: "עיצוב פרימיום",
    body: "עיצובים נקיים ועל-זמניים, בהשראת אסתטיקה מודרנית ומינימליסטית. כל פריט נבחר ומעוצב בקפידה כדי להיראות יוקרתי, אלגנטי ורלוונטי לאורך שנים — לא אופנתי לרגע, אלא קלאסי לתמיד.",
  },
];

export default function QualityPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-10 lg:px-16 lg:py-32">
        {/* Intro */}
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">
          מחויבות לאיכות
        </p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          איכות ואותנטיות
        </h1>
        <span className="mx-auto my-8 block h-px w-16 bg-gold" />
        <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-graphite">
          ב-Oridor אנו מאמינים שיוקרה אמיתית מתחילה באמת. כל פריט נוצר מחומרים
          מובחרים, בעבודת יד מדויקת ובשקיפות מלאה — כדי שתוכלי לענוד אותו בביטחון
          מוחלט, לכל החיים.
        </p>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-6 pb-8 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-platinum/50 bg-platinum/40 sm:grid-cols-2 md:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="flex flex-col items-center bg-canvas p-10 text-center lg:p-12">
              <p.icon size={28} strokeWidth={1.25} className="text-gold" />
              <h2 className="mt-6 text-lg font-light tracking-wide text-charcoal">
                {p.title}
              </h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Moissanite spec strip */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid grid-cols-3 divide-x divide-platinum/50 border-y border-platinum/50 [direction:ltr]">
          {[
            { label: "צבע", value: "D" },
            { label: "ניקיון", value: "VVS1" },
            { label: "ליטוש", value: "מושלם" },
          ].map((s) => (
            <div key={s.label} className="px-4 py-8 text-center">
              <p className="font-display text-2xl text-charcoal">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ash">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Satisfaction Guarantee */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10 lg:py-24">
          <BadgeCheck size={30} strokeWidth={1.25} className="mx-auto text-gold" />
          <h2 className="mt-6 text-3xl font-light leading-relaxed tracking-widest text-charcoal">
            הבטחת שביעות רצון
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed text-graphite">
            אנו עומדים מאחורי כל פריט שאנו יוצרים. אם מסיבה כלשהי אינך מרוצה
            לחלוטין, ניתן להחזיר או להחליף את התכשיט תוך 30 יום ממועד הקבלה — ללא
            שאלות. כל הזמנה מגיעה עם אריזת מתנה יוקרתית ותעודת אותנטיות.
          </p>
          <Link href="/collections/moissanite" className="btn-ghost mt-10">
            לצפייה בקולקציה
          </Link>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
