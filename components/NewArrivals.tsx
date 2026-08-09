import Link from "next/link";
import NewArrivalsGrid, { type NewArrival } from "./NewArrivalsGrid";
import { getLivePriceMap } from "@/lib/shopify";
import { overlayLivePrices } from "@/lib/catalog";
import data from "@/data/new_arrivals.json";

/**
 * Homepage section — "קולקציית כסף 925": strictly the solid-silver products.
 * Prices come from Shopify (overlaid by handle); JSON is only a fallback.
 */
export default async function NewArrivals() {
  const live = await getLivePriceMap();
  const highlights = overlayLivePrices((data as NewArrival[]).slice(0, 8), live);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
      <div className="mb-12 text-center">
        <h2 className="text-[32px] font-bold leading-tight tracking-wide text-charcoal sm:text-4xl">
          קולקציית כסף 925
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] font-semibold leading-relaxed text-charcoal sm:text-base">
          כסף סטרלינג 925 טהור ומוצק, לא ציפוי. נצנוץ על-זמני שנשאר לתמיד.
        </p>
      </div>

      <NewArrivalsGrid products={highlights} />

      <div className="mt-14 text-center">
        <Link href="/collections/silver" className="btn-ghost">
          לצפייה בכל הקולקציה
        </Link>
      </div>
    </section>
  );
}
