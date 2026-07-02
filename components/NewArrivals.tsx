import Link from "next/link";
import NewArrivalsGrid, { type NewArrival } from "./NewArrivalsGrid";
import data from "@/data/new_arrivals.json";

/**
 * "קולקציה חדשה" — a distinct, beautifully-spaced homepage section that
 * showcases the latest uploads in a strict, uniform square grid.
 */
export default function NewArrivals() {
  const highlights = (data as NewArrival[]).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">הגיעו עכשיו</p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          קולקציה חדשה
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm font-light text-graphite">
          הפריטים החדשים שלנו — כסף 925 טהור, נצנוץ על-זמני.
        </p>
      </div>

      <NewArrivalsGrid products={highlights} />

      <div className="mt-14 text-center">
        <Link href="/collection/new" className="btn-ghost">
          לצפייה בכל החדשים
        </Link>
      </div>
    </section>
  );
}
