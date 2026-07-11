"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, ArrowLeft, ChevronDown } from "lucide-react";

const SERVICE_LINKS = [
  { label: "צור קשר", href: "/contact" },
  { label: "איכות ואותנטיות", href: "/quality" },
  { label: "משלוחים והחזרות", href: "/shipping" },
  { label: "שאלות נפוצות", href: "/faq" },
  { label: "תקנון האתר", href: "/terms" },
];

const COLLECTION_LINKS = [
  { label: "קולקציית מואסניט", href: "/collections/moissanite" },
  { label: "קולקציית כסף 925", href: "/collections/new" },
  { label: "טבעות", href: "/rings" },
  { label: "כל הקולקציה", href: "/shop" },
];

/**
 * Premium site footer — strict RTL four-column grid, refined typography,
 * minimalist newsletter, social + payment trust signals.
 */
export default function PremiumFooter() {
  // Which link column is expanded on mobile (accordion). Only one open at a
  // time; `null` = all collapsed. Desktop (sm+) ignores this entirely.
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (title: string) =>
    setOpenSection((cur) => (cur === title ? null : title));

  return (
    <footer dir="rtl" className="bg-canvas text-charcoal">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 text-right sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-16">
        {/* Brand — first visual column on the right */}
        <div>
          <span className="text-2xl font-light uppercase tracking-brand text-charcoal">
            Oridor
          </span>
          <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-ash">
            תכשיטים על-זמניים המעוצבים מתוך אהבה לאסתטיקה נקייה ויוקרה יומיומית.
          </p>

          {/* Socials */}
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="אינסטגרם"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-platinum/70 text-ash transition-colors duration-300 hover:border-black hover:text-black"
            >
              <Instagram size={16} strokeWidth={1.5} />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="טיקטוק"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-platinum/70 text-ash transition-colors duration-300 hover:border-black hover:text-black"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>

        {/* Customer service */}
        <FooterColumn
          title="שירות לקוחות"
          links={SERVICE_LINKS}
          isOpen={openSection === "שירות לקוחות"}
          onToggle={() => toggle("שירות לקוחות")}
        />

        {/* Collections */}
        <FooterColumn
          title="הקולקציות"
          links={COLLECTION_LINKS}
          isOpen={openSection === "הקולקציות"}
          onToggle={() => toggle("הקולקציות")}
        />

        {/* Newsletter */}
        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-charcoal">
            הצטרפו למועדון
          </h3>
          <p className="mt-4 text-sm font-light leading-relaxed text-ash">
            קבלו 10% הנחה על ההזמנה הראשונה.
          </p>
          <form
            className="group mt-6 flex items-center gap-3 border-b border-platinum pb-2 transition-colors focus-within:border-black"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="כתובת אימייל"
              aria-label="כתובת אימייל"
              className="w-full bg-transparent text-sm font-light text-charcoal placeholder:text-ash focus:outline-none"
            />
            <button
              type="submit"
              aria-label="הרשמה לניוזלטר"
              className="-me-2 inline-flex h-11 w-11 shrink-0 items-center justify-center text-ash transition-colors duration-300 hover:text-black"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar — copyright + accepted payment methods */}
      <div className="border-t border-platinum/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row sm:px-10 lg:px-16">
          <p className="text-xs font-light text-ash">
            © 2026 Oridor. כל הזכויות שמורות.
          </p>
          <PaymentIcons />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  isOpen,
  onToggle,
}: {
  title: string;
  links: { label: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    // A hairline divider separates sections on mobile only; desktop is borderless.
    <div className="border-b border-platinum/50 sm:border-b-0">
      {/*
        Title row. On mobile it's a real toggle button with a flipping chevron.
        From sm: up it's a static, non-interactive heading (pointer-events-none,
        no chevron, no padding) so the desktop grid is completely unchanged.
      */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex min-h-[52px] w-full items-center justify-between text-start sm:pointer-events-none sm:min-h-0 sm:cursor-default"
      >
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-charcoal">
          {title}
        </h3>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          aria-hidden="true"
          className={`text-graphite transition-transform duration-300 sm:hidden ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/*
        Sub-links. Hidden on mobile unless this section is open; always visible
        from sm: up (with the original mt-4 spacing) so desktop is unchanged.
      */}
      <ul
        className={`space-y-1 pb-4 sm:mt-4 sm:block sm:pb-0 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-[44px] items-center text-sm font-light text-ash transition-colors duration-300 hover:text-black"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Minimalist TikTok glyph (lucide has no TikTok icon). */
function TikTokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.4c-1.2.1-2.3-.2-3.5-.8v5.8c0 3.7-2.7 6-5.9 5.6-2.7-.3-4.6-2.5-4.6-5.1 0-3 2.5-5.2 5.5-4.9v2.5c-.5-.1-1-.2-1.5-.1-1.2.2-2 1.1-1.9 2.4.1 1.2 1 2 2.2 2 1.3 0 2.2-1 2.2-2.5V3h3.5z" />
    </svg>
  );
}

/** Subtle, monochrome accepted-payment badges. */
function PaymentIcons() {
  const box =
    "inline-flex h-6 w-9 items-center justify-center rounded border border-platinum/70 bg-canvas text-ash";
  return (
    <div className="flex items-center gap-2" aria-label="אמצעי תשלום מקובלים">
      <span className={`${box} text-[8px] font-bold italic tracking-tight`}>VISA</span>
      <span className={box} aria-label="Mastercard">
        <span className="flex">
          <span className="h-2.5 w-2.5 rounded-full bg-platinum" />
          <span className="-ms-1 h-2.5 w-2.5 rounded-full bg-platinum" />
        </span>
      </span>
      <span className={`${box} gap-0.5 text-[8px] font-semibold`}>
        <svg width="7" height="8" viewBox="0 0 14 17" fill="currentColor" aria-hidden="true">
          <path d="M11.2 9c0-1.6 1.3-2.4 1.4-2.4-.8-1.1-2-1.3-2.4-1.3-1-.1-2 .6-2.5.6s-1.3-.6-2.2-.6C4 5.3 3 6 2.4 7.1c-1.2 2.1-.3 5.2.9 6.9.6.8 1.3 1.8 2.2 1.8.9 0 1.2-.6 2.3-.6s1.4.6 2.3.6c1 0 1.6-.9 2.2-1.7.7-1 1-2 1-2-.1 0-1.9-.8-1.9-2.1zM9.6 3.9c.5-.6.8-1.4.7-2.3-.7 0-1.6.5-2.1 1.1-.5.5-.9 1.4-.8 2.2.8.1 1.6-.4 2.2-1z" />
        </svg>
        Pay
      </span>
    </div>
  );
}
