import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import CollectionHero from "@/components/CollectionHero";
import { getLiveCatalog, sortByPriceAsc, COLLECTION_MOISSANITE } from "@/lib/catalog";

export const metadata: Metadata = {
  title: { absolute: "קולקציית מואסנייט | ברק שעוצר נשימה בכסף 925 | Oridor" },
  description:
    "אבני מואסנייט בדרגת D/VVS1 בעבודת יד, בכסף סטרלינג 925 מצופה רודיום. ברק שמתחרה ביהלום, במחיר הוגן. משלוח חינם ואחריות מלאה.",
  alternates: { canonical: "/collections/moissanite" },
};

// Re-fetch the live catalog at most every 2 min (ISR).
export const revalidate = 120;

export default async function MoissaniteCollectionPage() {
  const products = sortByPriceAsc(
    (await getLiveCatalog()).filter((p) => p.collection === COLLECTION_MOISSANITE),
  );
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <CollectionHero
        image="/photo/moissanite-collection-hero.webp"
        imagePosition="object-[center_55%]"
        scrim="bg-gradient-to-b from-black/45 via-black/40 to-black/60"
        eyebrow="ברק נצחי"
        title="קולקציית מואסנייט"
        subtitle="הניצוץ של היהלום, במחיר שמרגיש נכון."
        showAccents={false}
      />

      <section className="bg-[#ECEBE8]">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          {products.length === 0 ? (
            <p className="py-16 text-center text-sm font-light text-graphite">
              אין כרגע פריטי מואסנייט זמינים. הקולקציה מתעדכנת — חזרו בקרוב.
            </p>
          ) : (
            <>
              <Reveal>
                <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">
                  {products.map((p) => (
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
                      isMoissanite
                    />
                  ))}
                </div>
              </Reveal>
              <p className="mt-14 text-center text-xs font-light tracking-wide text-ash">
                {products.length} {products.length === 1 ? "פריט" : "פריטים"}
              </p>
            </>
          )}
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
