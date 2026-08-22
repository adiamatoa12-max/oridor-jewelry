import Link from "next/link";
import ProductCard from "./ProductCard";
import { getLiveCatalog, sortByPriceAsc, COLLECTION_MOISSANITE } from "@/lib/catalog";

/**
 * Homepage section — "קולקציית מואסנייט": a live preview of moissanite pieces,
 * fetched straight from Shopify. Hidden entirely when nothing is live.
 */
export default async function MoissanitePreview() {
  const highlights = sortByPriceAsc(
    (await getLiveCatalog()).filter((p) => p.collection === COLLECTION_MOISSANITE),
  ).slice(0, 8);

  if (highlights.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 pt-2 pb-12 sm:px-10 lg:px-16 lg:pt-4 lg:pb-16">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">ברק נצחי</p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          קולקציית מואסנייט
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] font-medium leading-relaxed tracking-wide text-charcoal">
          אבני מואסנייט בדרגת{" "}
          <span className="font-semibold text-gold">D / VVS1</span>, ברק שמתחרה
          ביהלומים.
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
            isMoissanite
          />
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link href="/collections/moissanite" className="btn-ghost">
          לצפייה בכל הקולקציה
        </Link>
      </div>
    </section>
  );
}
