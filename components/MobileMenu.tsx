"use client";

import Link from "next/link";
import { X } from "lucide-react";

const MAIN_LINKS = [
  { label: "קולקציה חדשה", href: "/new-arrivals" },
  { label: "שרשראות", href: "/necklaces" },
  { label: "צמידים", href: "/bracelets" },
  { label: "עגילים", href: "/earrings" },
  { label: "טבעות", href: "/rings" },
  { label: "מואסניט", href: "/collection/moissanite" },
  { label: "כלות", href: "/bridal" },
];

const UTILITY_LINKS = [
  { label: "התחברות / הרשמה", href: "/account" },
  { label: "שירות לקוחות", href: "/contact" },
  { label: "האינסטגרם שלנו", href: "https://instagram.com" },
];

/**
 * Full-height mobile navigation drawer (RTL).
 * Slides in from the right (inline-start in RTL) over a dark blurred backdrop,
 * with a fluid iOS-like easing. Kept mounted so enter/exit both animate.
 */
export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-[70] md:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Dark, blurred backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#1a1a1a]/40 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer panel — anchored to the right (inline-start in RTL) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
        className="absolute inset-y-0 start-0 flex w-[85vw] max-w-sm flex-col bg-canvas shadow-cardHover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
      >
        {/* Header — delicate close icon, generous padding */}
        <div className="flex p-6">
          <button
            type="button"
            aria-label="סגירת תפריט הניווט"
            onClick={onClose}
            className="-m-2 inline-flex h-11 w-11 items-center justify-center text-charcoal transition-colors hover:text-graphite"
          >
            <X size={22} strokeWidth={1.25} />
          </button>
        </div>

        {/* Main navigation — large, airy, right-aligned */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-8 pt-4 text-right">
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="mb-6 flex min-h-[44px] items-center justify-end text-2xl font-light tracking-wide text-[#2B2C2F] transition-colors duration-300 hover:text-graphite"
            >
              {link.label}
            </Link>
          ))}

          {/* Footer utility links */}
          <div className="mt-6 space-y-4 border-t border-gray-100 pt-6 text-right">
            {UTILITY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block min-h-[44px] text-sm text-gray-500 transition-colors duration-300 hover:text-charcoal"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </div>
  );
}
