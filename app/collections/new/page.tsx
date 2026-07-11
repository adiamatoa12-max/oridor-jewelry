import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import NewArrivalsGrid, { type NewArrival } from "@/components/NewArrivalsGrid";
import Reveal from "@/components/Reveal";
import CollectionHero from "@/components/CollectionHero";
import data from "@/data/new_arrivals.json";

const products = data as NewArrival[];

export const metadata: Metadata = {
  title: { absolute: "חדש באוסף | תכשיטי כסף 925 חדשים | Oridor" },
  description:
    "הפריטים החדשים של Oridor — עגילים, שרשראות וטבעות מכסף סטרלינג 925 טהור בציפוי רודיום. עיצובים נקיים וטריים. משלוח חינם.",
  alternates: { canonical: "/collections/new" },
};

export default function NewArrivalsPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <CollectionHero
        image="/photo/clara_post_4.jpg"
        eyebrow="חדש באוסף"
        title="חדש באוסף"
        subtitle="כסף סטרלינג 925 טהור ומוצק — בעיצוב נקי ועל-זמני."
      />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <Reveal><NewArrivalsGrid products={products} layout="grid" /></Reveal>
      </section>

      <PremiumFooter />
    </main>
  );
}
