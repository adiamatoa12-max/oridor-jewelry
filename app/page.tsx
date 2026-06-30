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
import PerfectSets from "@/components/PerfectSets";
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

      {/* Collections grid — prominent, immediately below the hero */}
      <Reveal><InstagramFeed /></Reveal>
      <Reveal><SplitPromoBanners /></Reveal>
      <Reveal><EditorialFeature /></Reveal>
      <Reveal><ShopTheLook /></Reveal>
      <Reveal><MoissanitePreview /></Reveal>
      <Reveal><CustomerReviews /></Reveal>
      <Reveal><Unboxing /></Reveal>
      <Reveal><PerfectSets /></Reveal>
      {/* Quality values — trust-building section just above the footer */}
      <Reveal><OridorQuality /></Reveal>

      <PremiumFooter />
    </main>
  );
}
