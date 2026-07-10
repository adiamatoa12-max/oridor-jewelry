import Link from "next/link";
import MoissaniteGrid, { type MoissaniteProduct } from "./MoissaniteGrid";
import products from "@/data/moissanite_collection.json";
import { getLivePriceMap } from "@/lib/shopify";

/**
 * Homepage section — "קולקציית מואסניט": strictly Moissanite products only.
 * Hybrid: local data drives the cards; live Shopify price is overlaid by handle
 * (slug). Safe no-op when Shopify is unconfigured.
 */
export default async function MoissanitePreview() {
  const live = await getLivePriceMap();
  const highlights = (products as MoissaniteProduct[])
    .slice(0, 8)
    .map((p) =>
      live[p.slug]
        ? {
            ...p,
            price: live[p.slug].price,
            compare_at_price: live[p.slug].compareAtPrice,
          }
        : p,
    );

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">ברק נצחי</p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          קולקציית מואסניט
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm font-light text-graphite">
          אבני מואסניט בדרגת D / VVS1 — ברק שמתחרה ביהלומים.
        </p>
      </div>

      <MoissaniteGrid products={highlights} />

      <div className="mt-14 text-center">
        <Link href="/collection/moissanite" className="btn-ghost">
          לצפייה בכל הקולקציה
        </Link>
      </div>
    </section>
  );
}
