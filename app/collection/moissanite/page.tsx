import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import MoissaniteCollection from "@/components/MoissaniteCollection";
import { type MoissaniteProduct } from "@/components/MoissaniteGrid";
import products from "@/data/moissanite_collection.json";

export const metadata: Metadata = {
  title: "קולקציית מואסניט — Oridor",
  description:
    "קולקציית המואסניט של Oridor — אבני מואסניט נוצצות בכסף 925 מצופה רודיום. ברק נצחי, יוקרה יומיומית.",
};

export default function MoissaniteCollectionPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <header className="mb-12 text-center">
          <p className="mb-3 text-xs tracking-[0.25em] text-gold">
            ברק נצחי
          </p>
          <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
            קולקציית מואסניט
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm font-light text-graphite">
            אבני מואסניט נוצצות בכסף 925 מצופה רודיום — ברק יוצא דופן, לכל יום
            ולכל אירוע.
          </p>
        </header>

        <MoissaniteCollection products={products as MoissaniteProduct[]} />
      </section>

      <PremiumFooter />
    </main>
  );
}
