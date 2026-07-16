import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { buildUnifiedCatalog, applyLiveStatus } from "@/lib/catalog";
import { getLivePriceMap } from "@/lib/shopify";

export const metadata: Metadata = {
  title: { absolute: "עגילים | כסף 925 אמיתי בציפוי רודיום | Oridor" },
  description:
    "עגילי Oridor — כסף 925 אמיתי בציפוי רודיום עמיד, עם תעודת איכות לכל תכשיט. מחיר השקה מיוחד: כל העגילים ב-200₪. משלוח חינם ואחריות מלאה.",
  alternates: { canonical: "/collections/earrings" },
};

// Earrings live across several collections (silver, new arrivals, moissanite),
// so we gather them from the unified catalog rather than a single data file.
export default async function EarringsPage() {
  const live = await getLivePriceMap();
  const earrings = applyLiveStatus(buildUnifiedCatalog(), live).filter(
    (p) => p.category === "Earrings",
  );

  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <header className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs tracking-[0.25em] text-gold">קולקציית העגילים</p>
          <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
            עגילים
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed text-graphite">
            עגילי Oridor – יוקרה שנועדה להישאר. כל העגילים שלנו מיוצרים מכסף 925
            אמיתי בציפוי רודיום עמיד, ומגיעים עם תעודת איכות לכל תכשיט. מחיר השקה
            מיוחד: כל העגילים ב-200₪.
          </p>
        </header>

        <Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
            {earrings.map((p) => (
              <ProductCard
                key={p.id}
                image={p.image}
                secondaryImage={p.secondaryImage}
                handle={p.handle}
                href={p.href}
                fit={p.fit}
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
          {earrings.length} {earrings.length === 1 ? "פריט" : "פריטים"}
        </p>
      </section>

      <PremiumFooter />
    </main>
  );
}
