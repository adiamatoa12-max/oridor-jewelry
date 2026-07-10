import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import SignatureGrid from "@/components/SignatureGrid";
import type { VariantProduct } from "@/components/VariantCard";
import data from "@/data/signature_collection.json";

const products = data as VariantProduct[];

export const metadata: Metadata = {
  title: { absolute: "קולקציית החתימה | שלושה גימורים בכסף 925 | Oridor" },
  description:
    "תכשיטי כסף סטרלינג 925 בשלושה גימורים — כסף, זהב וזהב ורוד. עיצוב חתימה על-זמני, בחרי את הצבע שלך. משלוח חינם ואחריות מלאה.",
  alternates: { canonical: "/collection/signature" },
};

export default function SignatureCollectionPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 pt-20 text-center sm:px-10 lg:pt-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">בחרי את הצבע שלך</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          קולקציית החתימה
        </h1>
        <span className="mx-auto mt-8 block h-px w-16 bg-gold" />
        <p className="mx-auto mt-8 max-w-xl text-base font-light leading-relaxed text-graphite">
          כל פריט זמין במגוון גימורים — כסף, זהב וזהב ורוד. לחצי על נקודת הצבע כדי
          לראות את הפריט בגוון שאהבת.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <SignatureGrid products={products} />
      </section>

      <PremiumFooter />
    </main>
  );
}
