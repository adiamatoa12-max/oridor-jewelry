import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ShopCatalog from "@/components/ShopCatalog";
import { buildUnifiedCatalog, applyLiveStatus, appendLiveProducts, sortByPriceAsc } from "@/lib/catalog";
import { getLivePriceMap, getLiveProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: { absolute: "כל הקולקציה | תכשיטי מואסנייט וכסף 925 | Oridor" },
  description:
    "כל תכשיטי Oridor במקום אחד: מואסנייט זוהר וכסף סטרלינג 925 טהור. טבעות, שרשראות, צמידים ועגילים, עם סינון מהיר לפי קטגוריה. משלוח חינם.",
  alternates: { canonical: "/shop" },
};

// Hybrid: local catalog drives the rich UI; live Shopify price + stock is
// overlaid by handle on the server (safe no-op if Shopify is unconfigured).
export default async function ShopPage() {
  // Hybrid Append (Option B): curated JSON drives the rich UI; live prices are
  // overlaid, and any Shopify product not already curated is appended live.
  const [live, liveProducts] = await Promise.all([getLivePriceMap(), getLiveProducts()]);
  const products = sortByPriceAsc(
    appendLiveProducts(applyLiveStatus(buildUnifiedCatalog(), live), liveProducts),
  );

  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-10 sm:pt-16 lg:px-16">
        <header className="mb-12 text-center lg:mb-14">
          <h1 className="text-[27px] font-medium leading-tight tracking-[0.1em] text-charcoal sm:text-[34px] lg:text-[40px]">
            הקולקציה המלאה
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[13px] font-light leading-relaxed tracking-[0.06em] text-graphite sm:text-sm">
            כל הקולקציות שלנו במקום אחד. בחרי קטגוריה וגלי.
          </p>
        </header>

        <ShopCatalog products={products} />
      </section>
    </main>
  );
}
