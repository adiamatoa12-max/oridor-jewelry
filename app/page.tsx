import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import SplitPromoBanners from "@/components/SplitPromoBanners";
import CustomerReviews from "@/components/CustomerReviews";
import OridorQuality from "@/components/OridorQuality";
import InstagramFeed from "@/components/InstagramFeed";
import PremiumFooter from "@/components/PremiumFooter";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import EditorialFeature from "@/components/EditorialFeature";
import Bestsellers from "@/components/Bestsellers";
import SignatureSets from "@/components/SignatureSets";
import MoissanitePreview from "@/components/MoissanitePreview";
import SilverPreview from "@/components/SilverPreview";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <Marquee />

      {/* 1. Collections grid — prominent, immediately below the hero */}
      <Reveal><InstagramFeed /></Reveal>
      {/* 2. Signature sets — high-value narrative right after collections */}
      <Reveal><SignatureSets /></Reveal>
      {/* 3. Featured jewelry showcase — individual pieces */}
      <Reveal><MoissanitePreview /></Reveal>
      {/* 4. New Silver collection — distinct, separate from Moissanite */}
      <Reveal><SilverPreview /></Reveal>
      {/* 5. Feature banners — 'אלגנטיות לערב' + 'קולקציית הטניס', 50/50 */}
      <Reveal><SplitPromoBanners /></Reveal>

      <Reveal><EditorialFeature /></Reveal>
      {/* Bestsellers — clean product-only row */}
      <Reveal><Bestsellers /></Reveal>
      <Reveal><CustomerReviews /></Reveal>
      {/* Quality values — trust-building section just above the footer */}
      <Reveal><OridorQuality /></Reveal>

      <PremiumFooter />
    </main>
  );
}
