import type { Metadata } from "next";
import { jsonLdHtml } from "@/lib/seo";
import {
  Assistant,
  Montserrat,
  Playfair_Display,
  Frank_Ruhl_Libre,
} from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import AccessibilityWidget from "@/components/AccessibilityWidget";

// Body sans — Hebrew-complete companion behind Montserrat (renders Hebrew copy).
const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-assistant",
  display: "swap",
});

// Primary body face (Latin). Renders English/numerals; Assistant covers Hebrew.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

// Primary heading face (Latin) — Playfair Display. Renders the "Oridor"
// wordmark, English accents and numerals; Frank Ruhl Libre covers Hebrew.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

// Editorial display serif — Hebrew-complete, renders Hebrew headings behind
// Playfair Display in the stack.
const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oridorjewelry.com";

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
    telephone: "+972-52-818-1568",
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
    <html lang="he" dir="rtl" className={`${assistant.variable} ${montserrat.variable} ${playfair.variable} ${frankRuhl.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(orgJsonLd) }}
        />
        <CartProvider>
          {children}
          <CartDrawer />
          <AccessibilityWidget />
        </CartProvider>
      </body>
    </html>
  );
}
