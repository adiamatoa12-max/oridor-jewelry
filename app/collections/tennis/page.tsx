import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getLiveCatalog, sortByPriceAsc, COLLECTION_MOISSANITE } from "@/lib/catalog";

export const metadata: Metadata = {
  title: { absolute: "קולקציית הטניס | צמידים ושרשראות זוהרים | Oridor" },
  description:
    "צמידי ושרשראות טניס בכסף סטרלינג 925 בציפוי רודיום — משובצים במואסנייט ובאבני חן נוצצות. שורת ברק רציפה, קלאסיקה שלא יוצאת מהאופנה. משלוח חינם ואחריות מלאה.",
  alternates: { canonical: "/collections/tennis" },
};

// Re-fetch live Shopify prices at most every 2 min (ISR).
export const revalidate = 120;

export default async function TennisCollectionPage() {
  // Every tennis piece in the live catalogue (title contains "טניס"), sorted
  // cheapest-first like the rest of the store.
  const tennis = sortByPriceAsc(
    (await getLiveCatalog()).filter((p) => p.title.includes("טניס")),
  );

  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <header className="mb-14 text-center">
          <p className="mb-3 text-xs tracking-[0.25em] text-gold">שורת ברק רציפה</p>
          <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
            קולקציית הטניס
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm font-light text-graphite">
            שורת אבנים נוצצת בכסף 925 בציפוי רודיום. קלאסיקה שלא יוצאת מהאופנה.
          </p>
        </header>

        <Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">
            {tennis.map((p) => (
              <ProductCard
                key={p.id}
                image={p.image}
                secondaryImage={p.secondaryImage}
                handle={p.handle}
                href={p.href}
                fit={p.fit}
                category={p.category}
                title={p.title}
                price={p.price}
                priceLabel={`₪${p.price.toLocaleString("he-IL")}`}
                compareAt={p.compareAtPrice}
                variants={p.variants}
                isMoissanite={p.collection === COLLECTION_MOISSANITE}
              />
            ))}
          </div>
        </Reveal>

        <p className="mt-14 text-center text-xs font-light tracking-wide text-ash">
          {tennis.length} {tennis.length === 1 ? "פריט" : "פריטים"}
        </p>
      </section>

      <PremiumFooter />
    </main>
  );
}
