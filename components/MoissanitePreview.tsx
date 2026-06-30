import Link from "next/link";
import MoissaniteGrid, { type MoissaniteProduct } from "./MoissaniteGrid";
import products from "@/data/moissanite_collection.json";

/**
 * Featured jewelry showcase — a curated selection of individual pieces with a
 * link through to the full collection.
 */
export default function MoissanitePreview() {
  const highlights = (products as MoissaniteProduct[]).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">
          נבחרת המעצבים
        </p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          תכשיטים מובחרים
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm font-light text-graphite">
          מבחר פריטים אהובים מהקולקציה שלנו — נוצצים, עדינים ולכל רגע.
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
