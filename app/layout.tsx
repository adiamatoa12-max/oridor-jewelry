import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-assistant",
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
    <html lang="he" dir="rtl" className={assistant.variable}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
