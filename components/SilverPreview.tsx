import Link from "next/link";
import SilverGrid, { type SilverProduct } from "./SilverGrid";
import data from "@/data/silver_collection.json";

/**
 * Homepage preview of the new Silver collection — a distinct, clearly-branded
 * section that links through to the dedicated collection page. Kept separate
 * from the Moissanite sections so the two lines never blend.
 */
export default function SilverPreview() {
  const highlights = (data as SilverProduct[]).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">קולקציה חדשה</p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          קולקציית כסף
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm font-light text-graphite">
          תכשיטי כסף 925 טהור — עיצוב נקי, על-זמני ומלוטש.
        </p>
      </div>

      <SilverGrid products={highlights} />

      <div className="mt-14 text-center">
        <Link href="/collection/silver" className="btn-ghost">
          לצפייה בכל הקולקציה
        </Link>
      </div>
    </section>
  );
}
