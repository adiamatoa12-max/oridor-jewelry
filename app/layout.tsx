import type { Metadata } from "next";
import { jsonLdHtml } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { Rubik } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import FloatingCartButton from "@/components/FloatingCartButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import MetaPixel from "@/components/MetaPixel";
import PromoPopup from "@/components/PromoPopup";

// Site-wide font — Rubik. One clean, modern, highly legible sans that covers
// both Hebrew and Latin, used for every role (headings, body, buttons, prices).
const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});


const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1536,
  height: 1024,
  alt: "קולקציית תכשיטי המואסנייט של Oridor: שרשרת, טבעת, עגילים וצמיד טניס",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Oridor | תכשיטי מואסנייט פרימיום",
    template: "%s | Oridor",
  },
  description:
    "Oridor מציעה תכשיטים עדינים ומודרניים מכסף 925 ואבני מואסנייט, בעיצוב מינימליסטי, על-זמני ואלגנטי שנועד ללוות אותך יום יום.",
  keywords: ["תכשיטים", "מואסנייט", "כסף 925", "טבעות", "שרשראות", "עגילים", "Oridor"],
  alternates: { canonical: "/" },
  verification: {
    google: "Zm3Pn5GM0Dl2U-03H0tCAqK3uOiSEaLdatkLCqy_fXo",
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "Oridor",
    title: "Oridor | תכשיטי מואסנייט פרימיום",
    description:
      "תכשיטים עדינים ומודרניים מכסף 925 ואבני מואסנייט, בעיצוב מינימליסטי, על-זמני ואלגנטי שנועד ללוות אותך יום יום.",
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oridor | תכשיטי מואסנייט פרימיום",
    description:
      "תכשיטים עדינים ומודרניים מכסף 925 ואבני מואסנייט, בעיצוב מינימליסטי, על-זמני ואלגנטי שנועד ללוות אותך יום יום.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

// Site-wide Organization structured data.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Oridor",
  url: SITE_URL,
  description: "תכשיטי יוקרה מכסף 925 ואבני מואסנייט.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+972-51-551-8689",
    contactType: "customer service",
    areaServed: "IL",
    availableLanguage: ["Hebrew"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body>
        <MetaPixel />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(orgJsonLd) }}
        />
        <CartProvider>
          {children}
          <CartDrawer />
          <FloatingCartButton />
          <AccessibilityWidget />
          <PromoPopup />
        </CartProvider>
      </body>
    </html>
  );
}
