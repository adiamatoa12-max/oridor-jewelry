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

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      {/* Single dynamic video hero */}
      <Hero />

      {/* Editorial rhythm — consistent 48px → 96px spacing scale between every
          section so the page breathes evenly on mobile and desktop. */}
      <div className="space-y-12 py-12 lg:space-y-24 lg:py-20">
        {/* Rhythmic block structure — Grid → Banner → Grid → Banner so the page
            reads as punchy, finished sections rather than an endless scroll. */}

        {/* Grid: category navigation */}
        <Reveal><InstagramFeed /></Reveal>

        {/* Grid: Moissanite collection */}
        <Reveal><MoissanitePreview /></Reveal>

        {/* Banner: full-width feature banners ('אלגנטיות לערב' + 'קולקציית הטניס') */}
        <Reveal><SplitPromoBanners /></Reveal>

        {/* Grid: 925 Silver new arrivals */}
        <Reveal><NewArrivals /></Reveal>

        {/* Grid: signature curated sets */}
        <Reveal><SignatureSets /></Reveal>

        {/* Banner: editorial materials band */}
        <Reveal><MoissaniteEducation /></Reveal>

        {/* Social proof, just above the footer */}
        <Reveal><CustomerReviews /></Reveal>
      </div>

      <PremiumFooter />
    </main>
  );
}
