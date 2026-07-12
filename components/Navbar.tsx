"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { useCart } from "./CartContext";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";

const LINKS = [
  { label: "הכל", href: "/shop" },
  { label: "מואסניט", href: "/collections/moissanite" },
  { label: "כסף 925", href: "/collections/silver" },
  { label: "טבעות", href: "/rings" },
];

/**
 * Premium RTL navbar — editorial stacked layout:
 *  · Top row: the ORIDOR wordmark, absolutely centered. Utility icons
 *    (search · account · cart) on the inline-end (left); mobile hamburger on
 *    the inline-start (right).
 *  · Second row (desktop only): the category links, centered below the logo
 *    and separated by a light hairline — brand identity above, navigation
 *    below. On mobile the nav row is hidden; the hamburger drawer handles it
 *    so the screen stays clean.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { openCart, count } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-platinum/40 bg-canvas/95 backdrop-blur-md transition-shadow duration-300 supports-[backdrop-filter]:bg-canvas/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Top row — brand identity */}
        <div className="relative flex h-16 items-center sm:h-20">
          {/* Absolutely-centered wordmark — true horizontal center of the row */}
          <Link
            href="/"
            aria-label="ORIDOR — לעמוד הבית"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-xl font-light uppercase tracking-brand text-charcoal sm:text-2xl lg:text-3xl"
          >
            ORIDOR
          </Link>

          {/* Inline-start (right): mobile hamburger only */}
          <div className="flex flex-1 items-center justify-start">
            <button
              type="button"
              aria-label="פתיחת תפריט הניווט"
              onClick={() => setOpen(true)}
              className="-ms-2 inline-flex h-11 w-11 items-center justify-center text-charcoal transition-colors hover:text-graphite md:hidden"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Inline-end (left): utility icons */}
          <div className="-me-2 flex flex-1 items-center justify-end gap-0.5 text-charcoal sm:gap-1">
            <button
              type="button"
              aria-label="חיפוש באתר"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center transition-colors hover:text-graphite"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>
            {/* Account link — hidden until the user-auth system is built.
                Re-enable by restoring this block and the `User` import. */}
            {/* <Link
              href="/account"
              aria-label="החשבון שלי"
              className="hidden h-11 w-11 items-center justify-center transition-colors hover:text-graphite md:inline-flex"
            >
              <User size={19} strokeWidth={1.5} />
            </Link> */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`עגלת קניות, ${count} פריטים`}
              className="relative inline-flex h-11 w-11 items-center justify-center transition-colors hover:text-graphite"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute end-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-charcoal px-1 text-[10px] font-medium leading-none text-canvas">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Second row — centered navigation, desktop only */}
        <nav className="hidden justify-center border-t border-platinum/30 md:flex">
          <ul className="flex items-center gap-7 py-3.5 lg:gap-9">
            {LINKS.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
            <SaleLink />
          </ul>
        </nav>
      </div>
      </header>

      {/* Mobile slide-in menu — rendered outside the blurred <header> so its
          fixed positioning is relative to the viewport, not the header box. */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />

      {/* Site search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

/** Eye-catching "Last Chance" sale link — gold, with a soft pulsing dot. */
function SaleLink() {
  return (
    <li>
      <Link
        href="/shop"
        className="group relative inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gold transition-opacity hover:opacity-80"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-soft-ping rounded-full bg-gold/70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
        מבצעים
      </Link>
    </li>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group relative text-[13px] font-medium uppercase tracking-wide text-charcoal transition-colors hover:text-gold"
      >
        {label}
        <span className="absolute -bottom-1.5 start-0 h-px w-0 bg-gold transition-all duration-500 ease-cinematic group-hover:w-full" />
      </Link>
    </li>
  );
}
