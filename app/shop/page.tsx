import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ShopCatalog from "@/components/ShopCatalog";
import { buildUnifiedCatalog, applyLiveStatus } from "@/lib/catalog";
import { getLivePriceMap } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "הקולקציה המלאה",
  description:
    "כל הקולקציות שלנו במקום אחד — מואסניט, קולקציית כסף וקולקציית החתימה. סינון מהיר לפי קטגוריה.",
};

// Hybrid: local catalog drives the rich UI; live Shopify price + stock is
// overlaid by handle on the server (safe no-op if Shopify is unconfigured).
export default async function ShopPage() {
  const live = await getLivePriceMap();
  const products = applyLiveStatus(buildUnifiedCatalog(), live);

  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-10 sm:pt-16 lg:px-16">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-light tracking-wide text-charcoal sm:text-3xl lg:text-4xl">
            הקולקציה המלאה
          </h1>
          <p className="mt-3 text-sm font-light text-graphite sm:mt-4">
            כל הקולקציות שלנו במקום אחד — בחרי קטגוריה וגלי.
          </p>
        </header>

        <ShopCatalog products={products} />
      </section>
    </main>
  );
}
