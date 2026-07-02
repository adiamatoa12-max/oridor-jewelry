import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ShopCatalog from "@/components/ShopCatalog";
import { buildCatalog } from "@/lib/products";

export const metadata: Metadata = {
  title: "הקולקציה המלאה",
  description:
    "גלי את הבחירות המוקפדות שלנו של תכשיטי כסף וזירקון — שרשראות, צמידים, עגילים וטבעות.",
};

// Full catalog — 28 real products mapped to local photos.
const PRODUCTS = buildCatalog();

export default function ShopPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-light tracking-wide text-charcoal">
            הקולקציה המלאה
          </h1>
          <p className="mt-4 text-sm font-light text-graphite">
            גלי את הבחירות המוקפדות שלנו של תכשיטי כסף וזירקון.
          </p>
        </header>

        <ShopCatalog products={PRODUCTS} />
      </section>
    </main>
  );
}
