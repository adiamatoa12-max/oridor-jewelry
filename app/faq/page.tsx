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
    q: "מהו מואסניט וכיצד הוא שונה מיהלום?",
    a: "מואסניט היא אבן חן יוקרתית בעלת ברק ואש יוצאי דופן. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    q: "האם התכשיטים עשויים כסף אמיתי?",
    a: "כל פריט נוצר מכסף סטרלינג 925 טהור בציפוי רודיום. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  },
  {
    q: "כמה זמן לוקח המשלוח?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
  },
  {
    q: "מהי מדיניות ההחזרות שלכם?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud.",
  },
  {
    q: "כיצד עליי לטפל בתכשיטים שלי?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor.",
  },
  {
    q: "האם ניתן להזמין פריט בהתאמה אישית?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
