import Link from "next/link";
import MoissaniteGrid, { type MoissaniteProduct } from "./MoissaniteGrid";
import products from "@/data/moissanite_collection.json";

/**
 * Homepage preview of the Moissanite collection — a few highlights with a link
 * through to the full collection page.
 */
export default function MoissanitePreview() {
  const highlights = (products as MoissaniteProduct[]).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mb-12 text-center">
        <p className="mb-3 font-serif text-sm italic tracking-wide text-gold">
          New Collection
        </p>
        <h2 className="text-3xl font-light leading-relaxed tracking-wide text-charcoal">
          קולקציית מואסניט
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm font-light text-graphite">
          אבני מואסניט נוצצות בכסף 925 מצופה רודיום — ברק יוצא דופן לכל יום.
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
