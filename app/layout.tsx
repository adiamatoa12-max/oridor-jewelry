import type { Metadata } from "next";
import { jsonLdHtml } from "@/lib/seo";
import { Assistant, Playfair_Display, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Cursor from "@/components/Cursor";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-assistant",
  display: "swap",
});

// Classic serif — used strictly for English decorative accents (Latin only).
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

// Editorial display serif — Hebrew-complete, used for luxury headings.
const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oridor.co.il";

const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1536,
  height: 1024,
  alt: "קולקציית תכשיטי המויסאניט של Oridor — שרשרת, טבעת, עגילים וצמיד טניס",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Oridor | תכשיטי מויסאניט פרימיום",
    template: "%s — Oridor",
  },
  description:
    "Oridor — תכשיטים עדינים ומודרניים מכסף 925 ואבני מואסניט. מינימליסטי, על-זמני, אלגנטי.",
  keywords: ["תכשיטים", "מואסניט", "כסף 925", "טבעות", "שרשראות", "עגילים", "Oridor"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "Oridor",
    title: "Oridor | תכשיטי מויסאניט פרימיום",
    description:
      "תכשיטים עדינים ומודרניים מכסף 925 ואבני מואסניט. מינימליסטי, על-זמני, אלגנטי.",
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oridor | תכשיטי מויסאניט פרימיום",
    description:
      "תכשיטים עדינים ומודרניים מכסף 925 ואבני מואסניט. מינימליסטי, על-זמני, אלגנטי.",
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
  description: "תכשיטי יוקרה מכסף 925 ואבני מואסניט.",
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
    <html lang="he" dir="rtl" className={`${assistant.variable} ${playfair.variable} ${frankRuhl.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(orgJsonLd) }}
        />
        <CartProvider>
          {children}
          <CartDrawer />
          <WhatsAppButton />
          <AccessibilityWidget />
          <Cursor />
        </CartProvider>
      </body>
    </html>
  );
}
