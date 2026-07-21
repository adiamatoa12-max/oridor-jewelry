import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import CollectionTrustBar from "@/components/CollectionTrustBar";
import CollectionHero from "@/components/CollectionHero";
import {
  buildUnifiedCatalog,
  applyLiveStatus,
  COLLECTION_SILVER,
} from "@/lib/catalog";
import { getLivePriceMap } from "@/lib/shopify";

export const revalidate = 120;

export const metadata: Metadata = {
  title: { absolute: "קולקציית כסף 925 | תכשיטים על-זמניים שלא מתכהים | Oridor" },
  description:
    "תכשיטי כסף סטרלינג 925 טהור בציפוי רודיום: עמידים, היפואלרגניים ומבריקים לתמיד. עיצוב נקי לכל יום, עם משלוח חינם ואחריות מלאה.",
  alternates: { canonical: "/collections/silver" },
};

/**
 * The single home for every solid-silver piece.
 *
 * Sourced from the unified catalog rather than one JSON file, so the silver,
 * signature and new-arrival sets all surface here. Each product keeps the href
 * the catalog assigns it, which means a signature piece still resolves to
 * /collections/signature/<slug> — the collection index pages were merged, the
 * product routes were not.
 */
export default async function SilverCollectionPage() {
  const live = await getLivePriceMap();
  const products = applyLiveStatus(buildUnifiedCatalog(), live).filter(
    (p) => p.collection === COLLECTION_SILVER,
  );

  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <CollectionHero
        image="/photo/silver-hero.webp"
        scrim="bg-gradient-to-b from-black/45 via-black/55 to-black/65"
        eyebrow="כסף 925 טהור"
        title="קולקציית כסף 925"
        subtitle="עיצוב נקי, על-זמני ומלוטש, לכל רגע."
      />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
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
              />
            ))}
          </div>
        </Reveal>

        <p className="mt-14 text-center text-xs font-light tracking-wide text-ash">
          {products.length} {products.length === 1 ? "פריט" : "פריטים"}
        </p>

        {/* Collection positioning — the material story lives here once, rather
            than being repeated across every category page. Placed below the
            grid so the pieces themselves are the first thing a shopper meets;
            the brand claims read as a closing note rather than a preamble. */}
        <p className="mx-auto mt-20 max-w-2xl text-center text-base font-light leading-relaxed text-graphite sm:text-sm lg:mt-24">
          עשויים כסף 925 אמיתי בציפוי רודיום יוקרתי, ולא פלדת אל-חלד.
        </p>

        <CollectionTrustBar className="mt-12" />
      </section>

      <PremiumFooter />
    </main>
  );
}
