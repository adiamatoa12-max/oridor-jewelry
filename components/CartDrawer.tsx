"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  X,
  Plus,
  Minus,
  Package,
  Gem,
  Sparkles,
  Check,
  Lock,
  ArrowLeft,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "./CartContext";

// The 3D vault reward is heavy (WebGL) — client-only, code-split, never SSR'd.
const VaultReward3D = dynamic(() => import("./VaultReward3D"), {
  ssr: false,
  loading: () => (
    <div className="mt-4 flex h-10 items-center justify-center">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
    </div>
  ),
});

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

// "2+1" promotion — add 3 items, the 3rd (a premium gift) is on us. Every
// third item in the cart unlocks another free gift.
const PROMO_SIZE = 3;
const GIFTS = [
  { id: "travel-box", label: "קופסת תכשיטים לנסיעות", Icon: Package },
  { id: "studs", label: "עגילי צמוד קלאסיים", Icon: Gem },
  { id: "care-kit", label: "ערכת טיפוח לתכשיטים", Icon: Sparkles },
] as const;

/**
 * Slide-out mini cart (RTL) — high-end boutique experience.
 * Overlay fades in; the panel slides from the left (inline-end in RTL). Kept
 * mounted so enter/exit both animate. A "2+1" step progress bar sits on top,
 * clean item cards fill the scroll region, and a sticky checkout footer with
 * secure-payment trust signals is always pinned at the bottom.
 */
export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    subtotal,
    count,
    updateQuantity,
    removeItem,
    checkoutUrl,
    busy,
  } = useCart();
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  // Progress within the current 3-item tier (0 → 3). A completed tier reads as
  // a full bar; the next item starts the following tier.
  const tierCount = count === 0 ? 0 : count % PROMO_SIZE || PROMO_SIZE;
  const toGo = PROMO_SIZE - tierCount; // items left to unlock the next gift
  const unlocked = count >= PROMO_SIZE;
  const freeItems = Math.floor(count / PROMO_SIZE);

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Dark backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-charcoal/40 backdrop-blur-[2px] transition-opacity duration-500 ease-cinematic ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer panel — anchored to the left (inline-end in RTL) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="עגלת קניות"
        className={`absolute end-0 top-0 flex h-full w-full max-w-md flex-col bg-canvas shadow-cardHover transition-transform duration-500 ease-cinematic ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header — exclusive "VIP Vault" identity */}
        <div className="flex items-center justify-between border-b border-platinum/50 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <Lock size={15} strokeWidth={1.5} className="text-gold" />
            <h2 className="text-base font-medium tracking-wide text-charcoal">
              הכספת שלך
            </h2>
            <span className="rounded-full border border-gold/50 bg-gold/10 px-2 py-0.5 text-[9px] font-semibold tracking-[0.15em] text-gold">
              VIP
            </span>
            <span className="text-sm font-light text-ash">({count})</span>
          </div>
          <button
            type="button"
            aria-label="סגירת עגלת הקניות"
            onClick={closeCart}
            className="-me-2 inline-flex h-11 w-11 items-center justify-center text-charcoal transition-colors hover:text-graphite"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable body — 2+1 reward on top, cart items right below. Both
            live in one scroll region so the items are never squeezed out of
            view by the tall reward block. */}
        <div className="flex-1 overflow-y-auto">
          {/* 2+1 promotion — step progress bar + gift selector */}
          {items.length > 0 && (
            <div className="border-b border-platinum/50 bg-cream/60 px-6 py-4">
              <p className="text-xs font-light leading-relaxed tracking-wide text-charcoal">
                {unlocked ? (
                  <>
                    <span className="font-medium text-gold">מבצע 2+1 פעיל!</span>{" "}
                    {freeItems > 1 ? `${freeItems} פריטים` : "הפריט השלישי"} עלינו —
                    בחרי את מתנת הפרימיום שלך ✨
                  </>
                ) : count === 0 ? (
                  <>
                    מבצע <span className="font-medium text-charcoal">2+1</span> —
                    הוסיפי 3 פריטים והשלישי מתנה 🎁
                  </>
                ) : (
                  <>
                    עוד{" "}
                    <span className="font-medium text-charcoal">{toGo}</span>{" "}
                    {toGo === 1 ? "פריט" : "פריטים"} ומבצע ה-2+1 יופעל 🎁
                  </>
                )}
              </p>

              {/* Stepped progress track — 3 segments fill from the start (right
                  in RTL) toward the gift at the inline-end. */}
              <div className="mt-3 flex items-center gap-2.5">
                <div className="flex flex-1 gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-700 ease-cinematic ${
                        tierCount > i
                          ? "bg-gradient-to-r from-gold to-[#E6D2A6]"
                          : "bg-platinum/40"
                      }`}
                    />
                  ))}
                </div>
                <Gift
                  size={16}
                  strokeWidth={1.5}
                  className={`flex-none transition-colors duration-500 ${
                    unlocked ? "text-gold" : "text-ash"
                  }`}
                />
              </div>

              {/* 3D vault reward — the robot presents the chosen gift */}
              <VaultReward3D show={unlocked && isOpen} selectedGift={selectedGift} />

              {/* Gift options — smooth height + fade reveal once unlocked */}
              <div
                className={`grid transition-all duration-700 ease-cinematic ${
                  unlocked
                    ? "mt-4 grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden px-1 pt-1">
                  <div className="grid grid-cols-3 gap-2">
                    {GIFTS.map(({ id, label, Icon }) => {
                      const active = selectedGift === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedGift(active ? null : id)}
                          aria-pressed={active}
                          className={`group relative flex flex-col items-center gap-2 rounded-sm border px-2 py-3 text-center transition-all duration-300 ease-cinematic ${
                            active
                              ? "scale-[1.04] border-gold bg-gold/10 shadow-[0_6px_20px_rgba(197,160,89,0.28)] ring-1 ring-gold/40"
                              : "border-platinum/60 bg-canvas hover:-translate-y-0.5 hover:border-gold/60"
                          }`}
                        >
                          {/* Very subtle breathing illumination on the chosen card */}
                          {active && (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 animate-pulse rounded-sm bg-white/35 [animation-duration:2.6s]"
                            />
                          )}
                          {active && (
                            <span className="absolute end-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gold text-canvas shadow-sm">
                              <Check size={10} strokeWidth={2.5} />
                            </span>
                          )}
                          <Icon
                            size={22}
                            strokeWidth={1.5}
                            className={active ? "text-gold" : "text-charcoal"}
                          />
                          <span className="text-[10px] font-light leading-tight text-graphite">
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedGift && (
                    <p className="mt-2 text-center text-[10px] font-light tracking-wide text-gold">
                      מתנת הפרימיום שלך שמורה ✓
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Items — clean cards: image on the right, details + price on the
              left, compact quantity stepper. */}
          <div className="px-6">
            {items.length === 0 ? (
              busy ? (
                <div className="flex justify-center py-16">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-platinum/40 border-t-gold" />
                </div>
              ) : (
                <p className="py-16 text-center text-sm font-light leading-relaxed text-ash">
                  הכספת שלך ריקה כרגע —<br />הוסיפי פריטים לאוסף שלך.
                </p>
              )
            ) : (
              <ul className="divide-y divide-platinum/30">
                {items.map((item) => {
                  const onSale =
                    item.compareAtPrice != null &&
                    item.compareAtPrice > item.price;
                  const saved = onSale
                    ? (item.compareAtPrice! - item.price) * item.quantity
                    : 0;
                  return (
                    <li key={item.id} className="flex gap-4 py-5">
                      {/* Product image (right in RTL) */}
                      <div className="relative aspect-square w-[88px] flex-none overflow-hidden rounded-lg bg-canvas">
                        <Image
                          src={item.image}
                          alt={`${item.title} — תכשיט מבית Oridor`}
                          fill
                          sizes="88px"
                          className="object-cover"
                        />
                      </div>

                      {/* Details + controls (left) */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-normal leading-snug text-charcoal">
                              {item.title}
                            </h3>
                            {item.variant && (
                              <p className="mt-0.5 text-xs font-light text-ash">
                                {item.variant}
                              </p>
                            )}
                          </div>
                          {/* Remove */}
                          <button
                            type="button"
                            aria-label={`הסרת ${item.title} מהעגלה`}
                            onClick={() => removeItem(item.id)}
                            className="-me-1.5 -mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full text-ash transition-colors hover:bg-platinum/20 hover:text-charcoal"
                          >
                            <X size={15} strokeWidth={1.5} />
                          </button>
                        </div>

                        {/* Price — sale price in green with struck-through original */}
                        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span
                            className={`text-sm font-medium ${
                              onSale ? "text-emerald-600" : "text-graphite"
                            }`}
                          >
                            {formatPrice(item.price)}
                          </span>
                          {onSale && (
                            <>
                              <span className="text-xs font-light text-ash line-through">
                                {formatPrice(item.compareAtPrice!)}
                              </span>
                              <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                                חסכת {formatPrice(saved)}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Bottom row — compact stepper + line total */}
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center rounded-full border border-platinum/60">
                            <button
                              type="button"
                              aria-label="הפחתת כמות"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-cream disabled:opacity-30"
                              disabled={item.quantity <= 1 || busy}
                            >
                              <Minus size={14} strokeWidth={1.75} />
                            </button>
                            <span className="min-w-7 text-center text-sm tabular-nums text-charcoal">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="הוספת כמות"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={busy}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-cream disabled:opacity-30"
                            >
                              <Plus size={14} strokeWidth={1.75} />
                            </button>
                          </div>

                          {item.quantity > 1 && (
                            <span className="text-sm font-light text-charcoal">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Footer: subtotal + checkout — pinned (sticky) at the bottom, floating
            above the scroll region with a soft upward shadow. */}
        <div className="border-t border-platinum/50 bg-canvas px-6 py-5 shadow-[0_-10px_30px_rgba(31,31,31,0.05)]">
          <div className="flex items-center justify-between">
            <span className="text-sm tracking-wide text-graphite">סך הכל הביניים</span>
            <span className="text-base font-normal text-charcoal">
              {formatPrice(subtotal)}
            </span>
          </div>
          <p className="mt-2 text-center text-xs font-light text-ash">
            משלוח חינם עד הבית מתווסף אוטומטית
          </p>
          <a
            href={checkoutUrl ?? "#"}
            aria-disabled={items.length === 0 || !checkoutUrl || busy}
            onClick={(e) => {
              if (items.length === 0 || !checkoutUrl || busy) e.preventDefault();
            }}
            className={`group mt-4 flex w-full items-center justify-center gap-2 bg-charcoal py-4 text-xs font-medium uppercase tracking-[0.2em] text-canvas transition-all duration-300 ease-cinematic hover:bg-gold hover:text-charcoal active:scale-[0.99] ${
              items.length === 0 || !checkoutUrl || busy
                ? "pointer-events-none cursor-not-allowed opacity-40"
                : ""
            }`}
          >
            <Lock size={14} strokeWidth={1.75} />
            מעבר לקופה מאובטחת
            <ArrowLeft
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
          </a>
          {/* Redirect reassurance — sets expectations that payment happens on a
              secure external page (Shopify's hosted checkout). */}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] font-light leading-relaxed text-ash">
            <Lock size={11} strokeWidth={1.75} className="flex-none text-gold" />
            תועברו לעמוד התשלום המאובטח שלנו להשלמת הרכישה
          </p>

          {/* Trust signals — honest "secure checkout" badge + accepted payment
              methods. Boosts conversion confidence at the decision point. */}
          <div className="mt-4 flex flex-col items-center gap-2 border-t border-platinum/40 pt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-platinum/60 bg-cream/60 px-3 py-1.5">
              <ShieldCheck size={13} strokeWidth={1.75} className="text-gold" />
              <span className="text-[10px] font-medium tracking-wide text-graphite">
                רכישה מאובטחת · הצפנת SSL
              </span>
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-light tracking-wide text-ash">
              <span>Visa</span>
              <span aria-hidden>·</span>
              <span>Mastercard</span>
              <span aria-hidden>·</span>
              <span>American Express</span>
              <span aria-hidden>·</span>
              <span>PayPal</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
