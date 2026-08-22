import Link from "next/link";
import ProductCard from "./ProductCard";
import { getLiveCatalog, sortByPriceAsc, COLLECTION_SILVER } from "@/lib/catalog";

/**
 * Homepage section — "קולקציית כסף 925": a live preview of solid-silver pieces,
 * fetched straight from Shopify. Hidden entirely when nothing is live.
 */
export default async function NewArrivals() {
  const highlights = sortByPriceAsc(
    (await getLiveCatalog()).filter((p) => p.collection === COLLECTION_SILVER),
  ).slice(0, 8);

  if (highlights.length === 0) return null;

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

      <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">
        {highlights.map((p) => (
          <ProductCard
            key={p.id}
            image={p.image}
            handle={p.handle}
            href={p.href}
            fit={p.fit}
            category={p.category}
            title={p.title}
            price={p.price}
            priceLabel={`₪${p.price.toLocaleString("he-IL")}`}
            compareAt={p.compareAtPrice}
          />
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link href="/collections/silver" className="btn-ghost">
          לצפייה בכל הקולקציה
        </Link>
      </div>
    </section>
  );
}
