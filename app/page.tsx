import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import SplitPromoBanners from "@/components/SplitPromoBanners";
import CustomerReviews from "@/components/CustomerReviews";
import InstagramFeed from "@/components/InstagramFeed";
import PremiumFooter from "@/components/PremiumFooter";
import Hero from "@/components/Hero";
import MoissanitePreview from "@/components/MoissanitePreview";
import NewArrivals from "@/components/NewArrivals";
import Reveal from "@/components/Reveal";
import MoissaniteEducation from "@/components/MoissaniteEducation";

// The curated-sets carousel was the only consumer of the live Shopify price map
// on this page, so the fetch (and the ISR window it needed) went with it. Every
// remaining section sources its own data.
export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      {/* Single dynamic video hero */}
      <Hero />

      {/* Editorial rhythm — consistent 48px → 96px spacing scale between every
          section so the page breathes evenly on mobile and desktop. Bottom
          padding only: the first section (הקולקציות שלנו) has its own top
          padding, so a wrapper top pad here just doubled the hero→collections
          gap. */}
      <div className="space-y-20 pb-16 sm:space-y-28 lg:space-y-36 lg:pb-28">
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

        {/* Banner: editorial materials band — soft sand band.
            Carries the sand band that the curated-sets section used to hold;
            without it everything from the promo banners down to the reviews
            reads as one unbroken white wall. */}
        <Reveal className="bg-sand/70"><MoissaniteEducation /></Reveal>

        {/* Social proof, just above the footer */}
        <Reveal><CustomerReviews /></Reveal>
      </div>

      <PremiumFooter />
    </main>
  );
}
