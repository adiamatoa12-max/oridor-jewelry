import type { Metadata } from "next";
import Link from "next/link";
import { Gem, ScrollText, ShieldCheck, Sparkles, BadgeCheck } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "אחריות ואיכות",
  description:
    "הבטחת האיכות של Oridor: מואסנייט בדרגת D / VVS1, תעודת אותנטיות GRA לכל תכשיט, כסף סטרלינג 925 בציפוי רודיום אנטי-החלדה ואחריות לכל החיים.",
  alternates: { canonical: "/quality-warranty" },
};

// The four quality pillars, each an expandable promise to the customer.
const PILLARS = [
  {
    icon: Gem,
    eyebrow: "האבן",
    title: "מואסנייט ברמה הגבוהה ביותר",
    body: "אנחנו בוחרים אך ורק אבני מואסנייט מובחרות: צבע D (לבן צח לחלוטין), ניקיון VVS1 וליטוש בדרגת Excellent. התוצאה היא ברק יוצא דופן ואש שמתחרה ביהלום טבעי, בכל תאורה. אבן על-זמנית, אתית ועמידה.",
  },
  {
    icon: ScrollText,
    eyebrow: "האותנטיות",
    title: "תעודת GRA לכל תכשיט",
    body: "כל פריט מגיע עם תעודת GRA (Gemological Research Association) המאמתת את מקוריות אבן המואסנייט ואת דרגתה. התעודה היא הביטחון שלך, הוכחה רשמית לכך שמה שאת עונדת הוא בדיוק מה שהובטח, ללא פשרות וללא תחליפים.",
  },
  {
    icon: Sparkles,
    eyebrow: "המתכת",
    title: "כסף 925 בציפוי רודיום",
    body: "בסיס כל תכשיט הוא כסף סטרלינג 925 טהור לכל עומקו, מתכת יקרה אמיתית ולא ציפוי על מתכת זולה. מעליו אנחנו מוסיפים שכבת רודיום המעניקה ברק לבן עז, הגנה מפני שריטות ועמידות אנטי-החלדה, כך שהתכשיט נשאר מבריק לאורך שנים.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "השקט הנפשי",
    title: "אחריות לכל החיים",
    body: "אנחנו עומדים מאחורי כל פריט שאנחנו יוצרים. כל תכשיט מכוסה באחריות לכל החיים כנגד פגמי ייצור, וכל הזמנה מגיעה באריזת מתנה יוקרתית. ניתן להחזיר או להחליף תוך 14 יום ממועד הקבלה, כדי שתוכלי לרכוש בביטחון מלא.",
  },
];

export default function QualityWarrantyPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      {/* Intro */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-10 lg:px-16 lg:py-32">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">
          הבטחת האיכות שלנו
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-charcoal lg:text-5xl">
          אחריות ואיכות
        </h1>
        <span className="mx-auto my-8 block h-px w-16 bg-gold" />
        <p className="mx-auto max-w-xl font-sans text-[15px] font-light leading-relaxed text-graphite">
          ב-Oridor יוקרה אמיתית מתחילה באמת. כל תכשיט נוצר מחומרים מובחרים, מלווה בתעודת אותנטיות ומגובה באחריות לכל החיים, כדי שתוכלי לענוד אותו בביטחון מלא, לתמיד.
        </p>
      </section>

      {/* Moissanite spec strip — the standard, stated plainly */}
      <section className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-3 divide-x divide-platinum/50 border-y border-platinum/50 [direction:ltr]">
          {[
            { label: "צבע", value: "D" },
            { label: "ניקיון", value: "VVS1" },
            { label: "ליטוש", value: "Excellent" },
          ].map((s) => (
            <div key={s.label} className="px-4 py-8 text-center">
              <p className="font-display text-2xl font-semibold text-charcoal lg:text-3xl">
                {s.value}
              </p>
              <p className="mt-2 font-sans text-xs uppercase tracking-[0.2em] text-ash">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars — alternating editorial rows for generous, premium spacing */}
      <section className="mx-auto max-w-4xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="flex flex-col gap-16 lg:gap-20">
          {PILLARS.map((p) => (
            <article
              key={p.title}
              className="flex flex-col items-center gap-5 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-platinum/60">
                <p.icon size={24} strokeWidth={1.25} className="text-gold" />
              </span>
              <div>
                <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.25em] text-gold">
                  {p.eyebrow}
                </p>
                <h2 className="font-display text-2xl font-semibold text-charcoal lg:text-3xl">
                  {p.title}
                </h2>
              </div>
              <p className="max-w-xl font-sans text-[15px] font-light leading-relaxed text-graphite">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Warranty guarantee close */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10 lg:py-24">
          <BadgeCheck size={30} strokeWidth={1.25} className="mx-auto text-gold" />
          <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-charcoal">
            מובטח לכל החיים
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-[15px] font-light leading-relaxed text-graphite">
            אנחנו יוצרים תכשיטים שנועדו ללוות אותך שנים, ומגבים אותם בהתאם. אם מסיבה כלשהי אינך מרוצה לחלוטין, אנחנו כאן. זו ההבטחה של Oridor.
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
