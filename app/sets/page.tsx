import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import SignatureSets from "@/components/SignatureSets";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: { absolute: "סטים תואמים | שרשרת, עגילים וטבעת | Oridor" },
  description:
    "סטים מעוצבים שנבחרו יחד: שרשרת, צמיד, עגילים וטבעת בכסף 925 עם מואסנייט, לרגעים הגדולים שלך. משלוח חינם ואחריות מלאה על כל פריט.",
  alternates: { canonical: "/sets" },
};

export default function SetsPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 pt-20 text-center sm:px-10 lg:pt-28">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">קולקציית הערב</p>
        <h1 className="text-4xl font-light leading-relaxed tracking-wide text-charcoal">
          אלגנטיות לערב
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm font-light text-graphite">
          סטים תואמים שנבחרו יחד: שרשרת, צמיד, עגילים וטבעת, לרגעים הגדולים ולאירועים הבלתי נשכחים.
        </p>
      </section>

      {/* Reuse the signature-sets showcase (grid layout) with its shop-the-look
          modal — each piece links to its real product page. */}
      <Reveal><SignatureSets layout="grid" /></Reveal>

      <PremiumFooter />
    </main>
  );
}
