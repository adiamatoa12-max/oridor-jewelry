import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import NewArrivalsGrid, { type NewArrival } from "@/components/NewArrivalsGrid";
import data from "@/data/new_arrivals.json";

const products = data as NewArrival[];

export const metadata: Metadata = {
  title: "קולקציה חדשה",
  description:
    "הפריטים החדשים של Oridor — תכשיטי כסף 925 טהור, נצנוץ על-זמני. עגילים, שרשראות ועוד.",
};

export default function NewArrivalsPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 pt-20 text-center sm:px-10 lg:pt-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-gold">הגיעו עכשיו</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          קולקציה חדשה
        </h1>
        <span className="mx-auto mt-8 block h-px w-16 bg-gold" />
        <p className="mx-auto mt-8 max-w-xl text-base font-light leading-relaxed text-graphite">
          הפריטים החדשים ביותר שלנו — כסף 925 טהור בציפוי רודיום, בעיצוב נקי ועל-זמני.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <NewArrivalsGrid products={products} />
      </section>

      <PremiumFooter />
    </main>
  );
}
