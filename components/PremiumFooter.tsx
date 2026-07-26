"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, ArrowLeft, ChevronDown } from "lucide-react";

const SERVICE_LINKS = [
  { label: "צור קשר", href: "/contact" },
  { label: "אחריות ואיכות", href: "/quality-warranty" },
  { label: "משלוחים והחזרות", href: "/shipping" },
  { label: "שאלות נפוצות", href: "/faq" },
  { label: "תקנון האתר", href: "/terms" },
];

const COLLECTION_LINKS = [
  { label: "קולקציית מואסנייט", href: "/collections/moissanite" },
  { label: "קולקציית כסף 925", href: "/collections/silver" },
  { label: "עגילים", href: "/collections/earrings" },
  { label: "כל הקולקציה", href: "/shop" },
];

// Legal / policy links, shown as a slim row in the bottom bar.
// - Privacy: the store's real, merchant-authored Shopify policy (hosted on
//   Shopify, so it opens externally).
// - Terms & Refund: the site's own Hebrew pages (/terms carries the terms and
//   the cancellation/refund clause; /shipping carries the returns process).
const LEGAL_LINKS: { label: string; href: string; external?: boolean }[] = [
  {
    label: "מדיניות פרטיות",
    href: "https://checkout.shopify.com/72303968298/policies/39484653610.html?locale=en",
    external: true,
  },
  { label: "תנאי שימוש", href: "/terms" },
  { label: "מדיניות החזרות", href: "/shipping" },
];

/**
 * Premium site footer — a deep near-black surface (bg-ink) with light, airy
 * typography and gold accents, for a clean, high-end break at the foot of the
 * page. Strict RTL four-column grid; the link columns collapse to accordions on
 * mobile. Social + payment trust signals sit in the bottom bar.
 */
export default function PremiumFooter() {
  // Which link column is expanded on mobile (accordion). Only one open at a
  // time; `null` = all collapsed. Desktop (sm+) ignores this entirely.
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (title: string) =>
    setOpenSection((cur) => (cur === title ? null : title));

  return (
    <footer dir="rtl" className="bg-ink text-platinum/70">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-6 py-16 text-right sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-16 lg:py-20">
        {/* Brand — first visual column on the right */}
        <div>
          <span className="text-2xl font-light uppercase tracking-brand text-cream">
            Oridor
          </span>
          <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-platinum/55">
            תכשיטים על-זמניים המעוצבים מתוך אהבה לאסתטיקה נקייה ויוקרה יומיומית.
          </p>

          {/* Socials */}
          <div className="mt-7 flex items-center gap-3">
            <a
              href="https://www.instagram.com/oridor.jewelry"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="אינסטגרם"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-platinum/70 transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              <Instagram size={16} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.tiktok.com/@oridor_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="טיקטוק"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-platinum/70 transition-colors duration-300 hover:border-gold hover:text-gold"
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
          <h3 className="text-[12px] font-medium uppercase tracking-[0.2em] text-cream">
            הצטרפי למועדון
          </h3>
          <p className="mt-4 text-sm font-light leading-relaxed text-platinum/55">
            קבלי 10% הנחה על ההזמנה הראשונה.
          </p>
          <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
            {/* Underline field with a distinct gold submit button — the line
                lifts to gold on focus, the button fills gold on hover. */}
            <div className="group flex items-center gap-2 border-b border-white/20 pb-2.5 transition-colors focus-within:border-gold">
              <input
                type="email"
                required
                placeholder="כתובת אימייל"
                aria-label="כתובת אימייל"
                className="w-full bg-transparent text-sm font-light text-cream placeholder:text-platinum/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="הרשמה לניוזלטר"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold transition-all duration-300 hover:bg-gold hover:text-ink"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom bar — legal links, then copyright + accepted payment methods */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 sm:px-10 lg:px-16">
          {/* Legal row — slim, centered, middot-separated. Wraps cleanly on
              narrow screens; each link keeps a comfortable tap target. */}
          <ul className="mb-5 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
            {LEGAL_LINKS.map((link, i) => (
              <li key={link.href} className="flex items-center gap-x-1.5">
                {i > 0 && (
                  <span aria-hidden="true" className="text-white/20">
                    ·
                  </span>
                )}
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[32px] items-center px-1 text-xs font-light text-platinum/50 transition-colors duration-300 hover:text-cream"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[32px] items-center px-1 text-xs font-light text-platinum/50 transition-colors duration-300 hover:text-cream"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <p className="text-xs font-light text-platinum/45">
              © 2026 Oridor. כל הזכויות שמורות.
            </p>
            <PaymentIcons />
          </div>
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
    <div className="border-b border-white/10 sm:border-b-0">
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
        <h3 className="text-[12px] font-medium uppercase tracking-[0.2em] text-cream">
          {title}
        </h3>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          aria-hidden="true"
          className={`text-platinum/50 transition-transform duration-300 sm:hidden ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/*
        Sub-links. Hidden on mobile unless this section is open; always visible
        from sm: up (with generous spacing) so desktop is unchanged.
      */}
      <ul
        className={`space-y-1 pb-4 sm:mt-5 sm:block sm:pb-0 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-[44px] items-center text-sm font-light text-platinum/60 transition-colors duration-300 hover:text-cream"
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

/**
 * Accepted-payment badges — crisp, uniform light-on-dark tiles. Kept monochrome
 * (not brand colours) so the row reads calm and premium against the dark footer
 * rather than busy. Visa · Mastercard · Apple Pay · Bit.
 */
function PaymentIcons() {
  const tile =
    "inline-flex h-7 w-[46px] items-center justify-center rounded-md border border-white/10 bg-white/[0.05] text-cream";
  return (
    <div className="flex items-center gap-2" aria-label="אמצעי תשלום מקובלים">
      {/* Visa */}
      <span className={`${tile} text-[10px] font-bold italic tracking-tight`} aria-label="Visa">
        VISA
      </span>

      {/* Mastercard — two overlapping discs */}
      <span className={tile} aria-label="Mastercard">
        <span className="flex">
          <span className="h-3 w-3 rounded-full bg-platinum/90" />
          <span className="-ms-1.5 h-3 w-3 rounded-full bg-platinum/45" />
        </span>
      </span>

      {/* Apple Pay */}
      <span className={`${tile} gap-[3px] text-[10px] font-medium`} aria-label="Apple Pay">
        <svg width="8" height="9" viewBox="0 0 14 17" fill="currentColor" aria-hidden="true">
          <path d="M11.2 9c0-1.6 1.3-2.4 1.4-2.4-.8-1.1-2-1.3-2.4-1.3-1-.1-2 .6-2.5.6s-1.3-.6-2.2-.6C4 5.3 3 6 2.4 7.1c-1.2 2.1-.3 5.2.9 6.9.6.8 1.3 1.8 2.2 1.8.9 0 1.2-.6 2.3-.6s1.4.6 2.3.6c1 0 1.6-.9 2.2-1.7.7-1 1-2 1-2-.1 0-1.9-.8-1.9-2.1zM9.6 3.9c.5-.6.8-1.4.7-2.3-.7 0-1.6.5-2.1 1.1-.5.5-.9 1.4-.8 2.2.8.1 1.6-.4 2.2-1z" />
        </svg>
        Pay
      </span>

      {/* Bit (Israeli payment app) */}
      <span className={`${tile} text-[11px] font-bold lowercase tracking-tight`} aria-label="Bit">
        bit
      </span>
    </div>
  );
}
