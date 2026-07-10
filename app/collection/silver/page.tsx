import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import SilverGrid, { type SilverProduct } from "@/components/SilverGrid";
import data from "@/data/silver_collection.json";

const products = data as SilverProduct[];

export const metadata: Metadata = {
  title: { absolute: "קולקציית כסף 925 | תכשיטים על-זמניים שלא מתכהים | Oridor" },
  description:
    "תכשיטי כסף סטרלינג 925 טהור בציפוי רודיום — עמידים, היפואלרגניים ולנצח מבריקים. עיצוב נקי לכל יום. משלוח חינם ואחריות מלאה.",
  alternates: { canonical: "/collection/silver" },
};

export default function SilverCollectionPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 pt-20 text-center sm:px-10 lg:pt-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">קולקציה חדשה</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          קולקציית כסף
        </h1>
        <span className="mx-auto mt-8 block h-px w-16 bg-gold" />
        <p className="mx-auto mt-8 max-w-xl text-base font-light leading-relaxed text-graphite">
          קולקציה חדשה של תכשיטי כסף 925 טהור — עיצוב נקי, על-זמני ומלוטש. כל
          פריט נבחר בקפידה כדי ללוות אתכן בכל רגע.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <SilverGrid products={products} />
      </section>

      <PremiumFooter />
    </main>
  );
}
