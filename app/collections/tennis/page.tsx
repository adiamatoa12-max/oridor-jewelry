import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import MoissaniteGrid, { type MoissaniteProduct } from "@/components/MoissaniteGrid";
import Reveal from "@/components/Reveal";
import products from "@/data/moissanite_collection.json";

export const metadata: Metadata = {
  title: { absolute: "קולקציית הטניס | צמידים ושרשראות זוהרים | Oridor" },
  description:
    "צמידי ושרשראות טניס: שורת אבני מואסנייט רציפה בכסף 925 מצופה רודיום. קלאסיקה נוצצת שלא יוצאת מהאופנה. משלוח חינם ואחריות מלאה.",
  alternates: { canonical: "/collections/tennis" },
};

// Only true tennis pieces — items whose name contains 'טניס'.
const tennis = (products as MoissaniteProduct[]).filter((p) =>
  p.name.includes("טניס"),
);

export default function TennisCollectionPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <header className="mb-14 text-center">
          <p className="mb-3 text-xs tracking-[0.25em] text-gold">שורת ברק רציפה</p>
          <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
            קולקציית הטניס
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm font-light text-graphite">
            צמידים ושרשראות טניס: שורה רציפה של אבני מואסנייט בכסף 925 מצופה רודיום. קלאסיקה שלא יוצאת מהאופנה.
          </p>
        </header>

        <Reveal><MoissaniteGrid products={tennis} layout="grid" /></Reveal>

        <p className="mt-14 text-center text-xs font-light tracking-wide text-ash">
          {tennis.length} {tennis.length === 1 ? "פריט" : "פריטים"}
        </p>
      </section>

      <PremiumFooter />
    </main>
  );
}
