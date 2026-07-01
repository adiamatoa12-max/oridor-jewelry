import type { Metadata } from "next";
import { Truck, RotateCcw, PackageCheck } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";

export const metadata: Metadata = {
  title: "משלוחים והחזרות — Oridor",
  description: "מדיניות המשלוחים וההחזרות של Oridor — משלוח מהיר, החזרות עם שליח עד הבית.",
};

const CARDS = [
  {
    icon: Truck,
    title: "משלוח מהיר",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: RotateCcw,
    title: "החזרות עד הבית",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
  },
  {
    icon: PackageCheck,
    title: "אריזה יוקרתית",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  },
];

const SECTIONS = [
  {
    title: "זמני אספקה",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "עלויות משלוח",
    body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
  },
  {
    title: "מדיניות החזרות והחלפות",
    body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.",
  },
  {
    title: "החזרים כספיים",
    body: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
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
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="flex flex-col items-center rounded-sm border border-platinum/40 bg-cream/40 p-10 text-center"
            >
              <c.icon size={26} strokeWidth={1.25} className="text-gold" />
              <h2 className="mt-5 text-lg font-light tracking-wide text-charcoal">
                {c.title}
              </h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-10 lg:py-24">
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
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
