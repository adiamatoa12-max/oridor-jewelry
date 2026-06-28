import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import CategoryShowcase from "@/components/CategoryShowcase";
import SplitPromoBanners from "@/components/SplitPromoBanners";
import CustomerReviews from "@/components/CustomerReviews";
import InstagramFeed from "@/components/InstagramFeed";
import PremiumFooter from "@/components/PremiumFooter";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import EditorialFeature from "@/components/EditorialFeature";
import ShopTheLook from "@/components/ShopTheLook";
import BestSellers from "@/components/BestSellers";
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

      <Reveal><CategoryShowcase /></Reveal>
      <Reveal><SplitPromoBanners /></Reveal>
      <Reveal><EditorialFeature /></Reveal>
      <Reveal><ShopTheLook /></Reveal>
      <Reveal><MoissanitePreview /></Reveal>
      <Reveal><CustomerReviews /></Reveal>
      <Reveal><Unboxing /></Reveal>
      <Reveal><BestSellers /></Reveal>
      <Reveal><InstagramFeed /></Reveal>

      <PremiumFooter />
    </main>
  );
}
