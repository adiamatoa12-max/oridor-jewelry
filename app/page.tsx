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
import ShopTheLook from "@/components/ShopTheLook";
import CraftStory from "@/components/CraftStory";
import SetQuiz from "@/components/SetQuiz";
import Unboxing from "@/components/Unboxing";
import MoissanitePreview from "@/components/MoissanitePreview";
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
      {/* 2. Featured jewelry showcase — individual pieces */}
      <Reveal><MoissanitePreview /></Reveal>
      {/* 3. Feature banners — 'אלגנטיות לערב' + 'קולקציית הטניס', 50/50 */}
      <Reveal><SplitPromoBanners /></Reveal>

      <Reveal><EditorialFeature /></Reveal>
      <Reveal><ShopTheLook /></Reveal>
      {/* Interactive quiz — fun, engaging discovery */}
      <Reveal><SetQuiz /></Reveal>
      <Reveal><CustomerReviews /></Reveal>
      {/* Craftsmanship story — captivating lifestyle imagery */}
      <Reveal><CraftStory /></Reveal>
      <Reveal><Unboxing /></Reveal>
      {/* Quality values — trust-building section just above the footer */}
      <Reveal><OridorQuality /></Reveal>

      <PremiumFooter />
    </main>
  );
}
