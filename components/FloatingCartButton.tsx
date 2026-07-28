"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

/**
 * Floating cart button — the prominent bottom-right action (the spot the
 * accessibility widget used to occupy). A deep-charcoal circle with a gold bag
 * icon, a soft lifted shadow and a gold item-count badge; tapping it slides the
 * cart drawer open. `floating-action` lifts it above the sticky PDP CTA on
 * phones. Sits at z-50, below the cart drawer (z-60), so it hides behind the
 * overlay while the drawer is open.
 */
export default function FloatingCartButton() {
  const { openCart, count } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={
        count > 0 ? `פתיחת סל הקניות, ${count} פריטים` : "פתיחת סל הקניות"
      }
      className="floating-action group fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-gold shadow-[0_14px_32px_-10px_rgba(26,26,26,0.6)] ring-1 ring-gold/25 transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:bg-[#111] hover:shadow-[0_18px_38px_-10px_rgba(26,26,26,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite"
    >
      <ShoppingBag
        size={22}
        strokeWidth={1.5}
        className="transition-transform duration-300 group-hover:scale-110"
      />

      {/* Item-count badge — gold pill with a canvas ring so it reads on the
          dark button. Hidden when the cart is empty. */}
      {count > 0 && (
        <span className="absolute -left-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold tabular-nums text-[#0a0a0a] ring-2 ring-canvas">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
