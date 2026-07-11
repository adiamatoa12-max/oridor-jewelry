import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import SplitPromoBanners from "@/components/SplitPromoBanners";
import CustomerReviews from "@/components/CustomerReviews";
import InstagramFeed from "@/components/InstagramFeed";
import PremiumFooter from "@/components/PremiumFooter";
import Hero from "@/components/Hero";
import SignatureSets from "@/components/SignatureSets";
import MoissanitePreview from "@/components/MoissanitePreview";
import NewArrivals from "@/components/NewArrivals";
import Reveal from "@/components/Reveal";
import MoissaniteEducation from "@/components/MoissaniteEducation";
import { getLivePriceMap } from "@/lib/shopify";

// Refresh live Shopify prices at most every 2 min (ISR).
export const revalidate = 120;

export default async function Home() {
  // Shopify prices by slug, passed to the client set carousel.
  const live = await getLivePriceMap();
  const livePrices = Object.fromEntries(
    Object.entries(live).map(([slug, s]) => [slug, s.price]),
  );
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      {/* Single dynamic video hero */}
      <Hero />

      {/* Editorial rhythm — consistent 48px → 96px spacing scale between every
          section so the page breathes evenly on mobile and desktop. */}
      <div className="space-y-20 py-16 sm:space-y-28 lg:space-y-36 lg:py-28">
        {/* Rhythmic block structure — Grid → Banner → Grid → Banner so the page
            reads as punchy, finished sections rather than an endless scroll. */}

        {/* Alternating soft bands (bg-sand) give the scroll depth and rhythm so
            the page never reads as one flat white wall. */}

        {/* Grid: category navigation */}
        <Reveal><InstagramFeed /></Reveal>

        {/* Grid: Moissanite collection — soft sand band */}
        <Reveal className="bg-sand/70"><MoissanitePreview /></Reveal>

        {/* Banner: full-width feature banners ('אלגנטיות לערב' + 'קולקציית הטניס') */}
        <Reveal><SplitPromoBanners /></Reveal>

        {/* Grid: 925 Silver new arrivals */}
        <Reveal><NewArrivals /></Reveal>

        {/* Grid: signature curated sets — soft sand band */}
        <Reveal className="bg-sand/70"><SignatureSets livePrices={livePrices} /></Reveal>

        {/* Banner: editorial materials band */}
        <Reveal><MoissaniteEducation /></Reveal>

        {/* Social proof, just above the footer */}
        <Reveal><CustomerReviews /></Reveal>
      </div>

      <PremiumFooter />
    </main>
  );
}
