import type { Metadata } from "next";
import { Assistant, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Cursor from "@/components/Cursor";

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

export const metadata: Metadata = {
  title: "Oridor — תכשיטי יוקרה",
  description:
    "Oridor — תכשיטים עדינים ומודרניים מכסף משובח. מינימליסטי, על-זמני, אלגנטי.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${playfair.variable}`}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
          <Cursor />
        </CartProvider>
      </body>
    </html>
  );
}
