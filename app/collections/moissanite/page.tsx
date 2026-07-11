import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import MoissaniteCollection from "@/components/MoissaniteCollection";
import { type MoissaniteProduct } from "@/components/MoissaniteGrid";
import CollectionHero from "@/components/CollectionHero";
import products from "@/data/moissanite_collection.json";

export const metadata: Metadata = {
  title: { absolute: "קולקציית מואסניט | ברק שעוצר נשימה בכסף 925 | Oridor" },
  description:
    "אבני מואסניט בדרגת D/VVS1 בעבודת יד, בכסף סטרלינג 925 מצופה רודיום. ברק שמתחרה ביהלום — במחיר הוגן. משלוח חינם ואחריות מלאה.",
  alternates: { canonical: "/collections/moissanite" },
};

export default function MoissaniteCollectionPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <CollectionHero
        image="/photo/moissanite-hero.webp"
        scrim="bg-gradient-to-b from-black/30 via-black/25 to-black/50"
        eyebrow="ברק נצחי"
        title="קולקציית מואסניט"
        subtitle="הניצוץ של היהלום, במחיר שמרגיש נכון."
      />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <MoissaniteCollection products={products as MoissaniteProduct[]} />
      </section>

      <PremiumFooter />
    </main>
  );
}
