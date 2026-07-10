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
        {/* Collections gallery — category navigation */}
        <Reveal><InstagramFeed /></Reveal>

        {/* ── The two distinct product collections ─────────────────────── */}
        {/* Section 1: Moissanite — ONLY moissanite products */}
        <Reveal><MoissanitePreview /></Reveal>
        {/* Section 2: 925 Silver — ONLY the solid-silver products */}
        <Reveal><NewArrivals /></Reveal>

        {/* Feature banners — 'אלגנטיות לערב' + 'קולקציית הטניס', 50/50 */}
        <Reveal><SplitPromoBanners /></Reveal>
        {/* Signature sets — curated lookbook (no individual-product overlap) */}
        <Reveal><SignatureSets /></Reveal>
        <Reveal><CustomerReviews /></Reveal>

        {/* Moissanite education — editorial vs.-zircon band near the page bottom */}
        <Reveal><MoissaniteEducation /></Reveal>
      </div>

      <PremiumFooter />
    </main>
  );
}
