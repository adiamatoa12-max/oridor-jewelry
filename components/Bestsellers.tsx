import Link from "next/link";
import MoissaniteGrid, { type MoissaniteProduct } from "./MoissaniteGrid";
import products from "@/data/moissanite_collection.json";

// Four top sellers — chosen across categories so the jewelry leads.
const TOP_IDS = ["matan-16", "matan-11", "matan-24", "matan-1"];

/**
 * "הנמכרים ביותר" — a clean, minimalist row of four top products on a light
 * background. Just the jewelry, no lifestyle imagery.
 */
export default function Bestsellers() {
  const all = products as MoissaniteProduct[];
  const top = TOP_IDS.map((id) => all.find((p) => p.id === id)).filter(
    Boolean,
  ) as MoissaniteProduct[];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
      <div className="mb-14 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">המבוקשים שלנו</p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          הנמכרים ביותר
        </h2>
      </div>

      <MoissaniteGrid products={top} />

      <div className="mt-16 text-center">
        <Link href="/collection/moissanite" className="btn-ghost">
          לכל הקולקציה
        </Link>
      </div>
    </section>
  );
}
