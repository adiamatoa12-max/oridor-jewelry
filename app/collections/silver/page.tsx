import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import SilverGrid, { type SilverProduct } from "@/components/SilverGrid";
import Reveal from "@/components/Reveal";
import CollectionHero from "@/components/CollectionHero";
import data from "@/data/silver_collection.json";

const products = data as SilverProduct[];

export const metadata: Metadata = {
  title: { absolute: "קולקציית כסף 925 | תכשיטים על-זמניים שלא מתכהים | Oridor" },
  description:
    "תכשיטי כסף סטרלינג 925 טהור בציפוי רודיום — עמידים, היפואלרגניים ולנצח מבריקים. עיצוב נקי לכל יום. משלוח חינם ואחריות מלאה.",
  alternates: { canonical: "/collections/silver" },
};

export default function SilverCollectionPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <CollectionHero
        image="/photo/silver-hero.webp"
        scrim="bg-gradient-to-b from-black/45 via-black/55 to-black/65"
        eyebrow="כסף 925 טהור"
        title="קולקציית כסף 925"
        subtitle="עיצוב נקי, על-זמני ומלוטש — לכל רגע."
      />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <Reveal><SilverGrid products={products} /></Reveal>
      </section>

      <PremiumFooter />
    </main>
  );
}
