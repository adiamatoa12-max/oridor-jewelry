import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import RingSizeGuide from "@/components/RingSizeGuide";

export const metadata: Metadata = {
  title: "מדריך מידות טבעת",
  description:
    "מדריך פשוט למדידת היקף האצבע בבית ומציאת מידת הטבעת המדויקת שלך.",
};

export default function RingSizeGuidePage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <RingSizeGuide />

      <div className="pb-20 text-center">
        <Link href="/collection/moissanite" className="btn-ghost">
          חזרה לקולקציה
        </Link>
      </div>

      <PremiumFooter />
    </main>
  );
}
