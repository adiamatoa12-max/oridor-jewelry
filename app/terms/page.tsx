import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "תקנון האתר — Oridor",
  description: "תקנון האתר ותנאי השימוש של Oridor.",
};

const SECTIONS = [
  {
    title: "1. כללי",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "2. הזמנות ותשלומים",
    body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    title: "3. משלוחים",
    body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    title: "4. ביטולים והחזרות",
    body: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
  },
  {
    title: "5. קניין רוחני",
    body: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  },
  {
    title: "6. אחריות והגבלתה",
    body: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
  },
];

export default function TermsPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10 lg:py-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">מדיניות ותנאים</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          תקנון האתר
        </h1>
        <span className="mx-auto my-8 block h-px w-16 bg-gold" />
        <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-graphite">
          אנא קראי בעיון את תנאי השימוש באתר Oridor. השימוש באתר ובשירותיו מהווה
          הסכמה לתנאים המפורטים להלן.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 sm:px-10">
        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-normal tracking-wide text-charcoal">
                {s.title}
              </h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
                {s.body}
              </p>
            </div>
          ))}
          <p className="border-t border-platinum/40 pt-8 text-xs font-light text-ash">
            עודכן לאחרונה: יולי 2026
          </p>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
