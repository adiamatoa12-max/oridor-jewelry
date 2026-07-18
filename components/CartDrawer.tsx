"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  Check,
  Lock,
  ArrowLeft,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "./CartContext";

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

// "2+1" promotion — add 3 items, the 3rd (a premium gift) is on us. Every
// third item in the cart unlocks another free gift.
const PROMO_SIZE = 3;
// The complimentary gift is a genuine Oridor piece — real product imagery makes
// the choice feel like a premium boutique gift rather than a generic plugin.
const GIFTS = [
  {
    id: "studs",
    title: "עגילי סוליטר קלאסיים",
    subtitle: "נצנוץ יומיומי, כסף 925",
    image: "/photo/moissanite-28.png",
  },
  {
    id: "bracelet",
    title: "צמיד סוליטר עדין",
    subtitle: "עדין, מחמיא לכל יד",
    image: "/photo/moissanite-3.png",
  },
  {
    id: "necklace",
    title: "שרשרת תליון סוליטר",
    subtitle: "קלאסיקה שלא נגמרת",
    image: "/photo/moissanite-18.png",
  },
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

        {/* 2+1 progress — pinned directly under the header, OUTSIDE the scroll
            region, so how far the shopper is from the free gift stays visible
            no matter how long the cart gets. */}
        {items.length > 0 && (
          <div className="flex-none border-b border-platinum/60 bg-cream px-6 py-4 shadow-[0_6px_16px_-12px_rgba(31,31,31,0.4)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] leading-snug text-charcoal">
                {unlocked ? (
                  <>
                    <span className="font-semibold text-gold">מבצע 2+1 פעיל!</span>{" "}
                    {freeItems > 1 ? `${freeItems} פריטים` : "הפריט השלישי"} עלינו ✨
                  </>
                ) : (
                  <>
                    עוד{" "}
                    <span className="text-xl font-semibold tabular-nums text-gold">
                      {toGo}
                    </span>{" "}
                    <span className="font-medium">
                      {toGo === 1 ? "פריט" : "פריטים"}
                    </span>{" "}
                    והמתנה שלך אצלך 🎁
                  </>
                )}
              </p>
              {/* Explicit step counter — reinforces exactly what's left */}
              <span className="flex-none rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-gold">
                {tierCount}/{PROMO_SIZE}
              </span>
            </div>

            {/* Chunky track: fills from the start (right in RTL) toward the
                gift at the end, with notches marking each of the 3 steps. */}
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-platinum/50">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-gold via-[#D9BE7E] to-[#E6D2A6] transition-[width] duration-700 ease-cinematic"
                  style={{ width: `${(tierCount / PROMO_SIZE) * 100}%` }}
                />
                {[1, 2].map((i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-px bg-canvas/80"
                    style={{ insetInlineStart: `${(i / PROMO_SIZE) * 100}%` }}
                  />
                ))}
              </div>
              <Gift
                size={19}
                strokeWidth={1.5}
                className={`flex-none transition-all duration-500 ${
                  unlocked ? "scale-110 text-gold" : "text-ash/70"
                }`}
              />
            </div>
          </div>
        )}

        {/* Scrollable body — gift selection, then the cart items. */}
        <div className="flex-1 overflow-y-auto">
          {/* Gift options — collapses to zero height until the tier is reached.
              Premium cards: real product imagery, generous padding, a
              standout heading, and a clear gold selection state. */}
          {items.length > 0 && (
            <div
              className={`grid bg-cream/60 transition-all duration-700 ease-cinematic ${
                unlocked
                  ? "grid-rows-[1fr] border-b border-platinum/50 opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 py-5">
                  {/* Section heading — clear hierarchy so the invitation stands out. */}
                  <div className="mb-3.5 text-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                      מתנה על הבית
                    </p>
                    <h3 className="mt-1.5 text-lg font-medium tracking-wide text-charcoal">
                      בחרי את המתנה שלך
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {GIFTS.map(({ id, title, subtitle, image }) => {
                      const active = selectedGift === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedGift(active ? null : id)}
                          aria-pressed={active}
                          className={`group relative flex w-full items-center gap-3.5 rounded-2xl border p-3 text-start transition-all duration-300 ease-cinematic ${
                            active
                              ? "scale-[1.015] border-gold bg-gold/[0.06] shadow-[0_14px_34px_-14px_rgba(197,160,89,0.55)] ring-1 ring-gold/40"
                              : "border-platinum/60 bg-canvas shadow-card hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-cardHover"
                          }`}
                        >
                          {/* Product image */}
                          <div className="relative h-[68px] w-[68px] flex-none overflow-hidden rounded-xl bg-cream">
                            <Image
                              src={image}
                              alt={`${title} — מתנת פרימיום מבית Oridor`}
                              fill
                              sizes="68px"
                              className="object-cover transition-transform duration-500 ease-cinematic group-hover:scale-105"
                            />
                          </div>

                          {/* Copy */}
                          <div className="min-w-0 flex-1">
                            <p className="text-[13.5px] font-medium leading-snug text-charcoal">
                              {title}
                            </p>
                            <p className="mt-0.5 text-[11px] font-light leading-snug text-ash">
                              {subtitle}
                            </p>
                            <p className="mt-1.5 text-[10px] font-medium tracking-[0.12em] text-gold">
                              ✦ כלול במתנה
                            </p>
                          </div>

                          {/* Selection indicator — empty ring → filled gold check */}
                          <span
                            aria-hidden="true"
                            className={`flex-none inline-flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ${
                              active
                                ? "border-gold bg-gold text-canvas shadow-sm"
                                : "border-platinum/70 bg-transparent text-transparent group-hover:border-gold/50"
                            }`}
                          >
                            <Check size={13} strokeWidth={2.75} />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedGift && (
                    <p className="mt-3 text-center text-[11px] font-light tracking-wide text-gold">
                      המתנה שלך שמורה — נוסיף אותה לחבילה שלך ✓
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

        {/* Footer: total + checkout — pinned (sticky) at the bottom, floating
            above the scroll region with a soft upward shadow. Pared back to the
            essentials: total figure, CTA, and trust signals. */}
        <div className="border-t border-platinum/50 bg-canvas px-6 py-6 shadow-[0_-10px_30px_rgba(31,31,31,0.05)]">
          {/* Total — the price figure only, no label */}
          <p className="text-center text-2xl font-normal tracking-wide text-charcoal">
            {formatPrice(subtotal)}
          </p>

          <a
            href={checkoutUrl ?? "#"}
            aria-disabled={items.length === 0 || !checkoutUrl || busy}
            onClick={(e) => {
              if (items.length === 0 || !checkoutUrl || busy) e.preventDefault();
            }}
            className={`group mt-5 flex w-full items-center justify-center gap-2 bg-charcoal py-4 text-xs font-medium uppercase tracking-[0.2em] text-canvas transition-all duration-300 ease-cinematic hover:bg-gold hover:text-charcoal active:scale-[0.99] ${
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

          {/* Trust signals — SSL badge + accepted payment methods */}
          <div className="mt-5 flex flex-col items-center gap-2.5">
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
