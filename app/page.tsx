import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import SplitPromoBanners from "@/components/SplitPromoBanners";
import CustomerReviews from "@/components/CustomerReviews";
import OridorQuality from "@/components/OridorQuality";
import InstagramFeed from "@/components/InstagramFeed";
import PremiumFooter from "@/components/PremiumFooter";
import Hero from "@/components/Hero";
import NewCollectionBanner from "@/components/NewCollectionBanner";
import TrustStrip from "@/components/TrustStrip";
import EditorialFeature from "@/components/EditorialFeature";
import SignatureSets from "@/components/SignatureSets";
import MoissanitePreview from "@/components/MoissanitePreview";
import NewArrivals from "@/components/NewArrivals";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Hero />

      {/* Editorial banner for the new 925-silver collection */}
      <Reveal><NewCollectionBanner /></Reveal>
      {/* Trust signals strip */}
      <TrustStrip />

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
      <Reveal><EditorialFeature /></Reveal>
      <Reveal><CustomerReviews /></Reveal>
      {/* Quality values — trust-building section just above the footer */}
      <Reveal><OridorQuality /></Reveal>

      <PremiumFooter />
    </main>
  );
}
