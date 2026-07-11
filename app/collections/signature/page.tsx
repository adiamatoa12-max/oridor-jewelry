import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import SignatureGrid from "@/components/SignatureGrid";
import Reveal from "@/components/Reveal";
import type { VariantProduct } from "@/components/VariantCard";
import CollectionHero from "@/components/CollectionHero";
import data from "@/data/signature_collection.json";

const products = data as VariantProduct[];

export const metadata: Metadata = {
  title: { absolute: "קולקציית החתימה | שלושה גימורים בכסף 925 | Oridor" },
  description:
    "תכשיטי כסף סטרלינג 925 בשלושה גימורים — כסף, זהב וזהב ורוד. עיצוב חתימה על-זמני, בחרי את הצבע שלך. משלוח חינם ואחריות מלאה.",
  alternates: { canonical: "/collections/signature" },
};

export default function SignatureCollectionPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <CollectionHero
        image="/photo/set-1.jpeg"
        eyebrow="בחרי את הצבע שלך"
        title="קולקציית החתימה"
        subtitle="כל פריט במגוון גימורים — כסף, זהב וזהב ורוד."
      />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <Reveal><SignatureGrid products={products} /></Reveal>
      </section>

      <PremiumFooter />
    </main>
  );
}
