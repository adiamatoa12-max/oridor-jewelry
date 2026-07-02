"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { useCart } from "./CartContext";
import MobileMenu from "./MobileMenu";

const LINKS = [
  { label: "הכל", href: "/shop" },
  { label: "מואסניט", href: "/collection/moissanite" },
  { label: "כסף 925", href: "/collection/new" },
  { label: "טבעות", href: "/rings" },
];

/**
 * Premium RTL navbar — stable three-section flex layout:
 *  · AMATO wordmark on the far right (inline-start in RTL)
 *  · category links perfectly centered in the middle
 *  · utility icons on the far left (inline-end in RTL)
 * The two side groups are equal-width (flex-1) so the centered links stay
 * dead-centre regardless of their content. Mobile: hamburger reveals a drawer.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { openCart, count } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-platinum/50 bg-canvas/95 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/90">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 lg:px-10">
        {/* Far right (RTL start): logo + mobile hamburger */}
        <div className="flex flex-1 items-center gap-2">
          <Link
            href="/"
            className="select-none text-2xl font-light uppercase tracking-brand text-charcoal lg:text-3xl"
          >
            ORIDOR
          </Link>
          <button
            type="button"
            aria-label="פתיחת תפריט הניווט"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center text-charcoal transition-colors hover:text-graphite md:hidden"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Center: category links — single flex row, even breathable spacing */}
        <ul className="hidden items-center justify-center gap-6 md:flex lg:gap-8">
          {LINKS.map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
          <SaleLink />
        </ul>

        {/* Far left (RTL end): utility icons */}
        <div className="-me-2 flex flex-1 items-center justify-end gap-1 text-charcoal">
          <button
            type="button"
            aria-label="חיפוש באתר"
            className="inline-flex h-11 w-11 items-center justify-center transition-colors hover:text-graphite"
          >
            <Search size={19} strokeWidth={1.5} />
          </button>
          <Link
            href="/account"
            aria-label="החשבון שלי"
            className="inline-flex h-11 w-11 items-center justify-center transition-colors hover:text-graphite"
          >
            <User size={19} strokeWidth={1.5} />
          </Link>
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
      </nav>
      </header>

      {/* Mobile slide-in menu — rendered outside the blurred <header> so its
          fixed positioning is relative to the viewport, not the header box. */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />
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
