import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import NewArrivalsGrid, { type NewArrival } from "@/components/NewArrivalsGrid";
import Reveal from "@/components/Reveal";
import data from "@/data/new_arrivals.json";

const products = data as NewArrival[];

export const metadata: Metadata = {
  title: { absolute: "חדש באוסף | תכשיטי כסף 925 חדשים | Oridor" },
  description:
    "הפריטים החדשים של Oridor — עגילים, שרשראות וטבעות מכסף סטרלינג 925 טהור בציפוי רודיום. עיצובים נקיים וטריים. משלוח חינם.",
  alternates: { canonical: "/collection/new" },
};

export default function NewArrivalsPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 pt-20 text-center sm:px-10 lg:pt-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">כסף 925 טהור</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          קולקציית כסף 925
        </h1>
        <span className="mx-auto mt-8 block h-px w-16 bg-gold" />
        <p className="mx-auto mt-8 max-w-xl text-base font-light leading-relaxed text-graphite">
          כסף סטרלינג 925 טהור ומוצק (לא ציפוי), בעיצוב נקי ועל-זמני.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <Reveal><NewArrivalsGrid products={products} layout="grid" /></Reveal>
      </section>

      <PremiumFooter />
    </main>
  );
}
