"use client";

import { useEffect, useRef, useState } from "react";
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

// "2+1" promotion — reach 3 items and the 3rd (a premium gift) is on us.
// "2+1": buy 2, the 3rd is on us. The picker therefore unlocks at TWO items —
// the third is the gift itself, so requiring three to unlock it would be
// circular. One-time: once reached it stays unlocked as the cart grows.
const GIFT_THRESHOLD = 2;
/**
 * A gift the shopper may claim. Resolved at runtime from the store's own
 * Buy X Get Y rule via /api/gift-options — never hardcoded, so the picker can
 * only ever offer products that genuinely qualify for the free item.
 */
interface GiftOption {
  variantId: string | null;
  handle: string;
  title: string;
  image: string | null;
  price: number;
}

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
    addVariant,
    checkoutUrl,
    busy,
  } = useCart();
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  // Eligible gifts come from the live Shopify discount rule, fetched lazily the
  // first time the shopper actually reaches the tier — so the request only
  // happens when the picker is about to be shown.
  const [gifts, setGifts] = useState<GiftOption[]>([]);
  const [giftsState, setGiftsState] = useState<"idle" | "loading" | "done">(
    "idle",
  );

  // The drawer stays mounted, so its scroll position would otherwise persist
  // between openings — reopening after browsing the gifts would land the
  // shopper mid-list. Reset to the top so the cart items are always what they
  // see first.
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) bodyRef.current?.scrollTo({ top: 0 });
  }, [isOpen]);

  // One-time unlock at GIFT_THRESHOLD items. `count` is Shopify's totalQuantity —
  // the sum of line QUANTITIES, not the number of lines — so three separate
  // products and a single product at quantity three both reach the gift.
  //
  // Progress deliberately clamps rather than wrapping: wrapping sent the bar
  // backwards once the cart grew past the threshold while the copy still read
  // "unlocked", so the bar contradicted the message.
  const progress = Math.min(count, GIFT_THRESHOLD); // 0 → 2, never resets
  const toGo = Math.max(0, GIFT_THRESHOLD - count); // items still needed
  const unlocked = count >= GIFT_THRESHOLD;

  useEffect(() => {
    if (!unlocked || giftsState !== "idle") return;
    setGiftsState("loading");
    fetch("/api/gift-options")
      .then((r) => r.json())
      .then((d: { gifts?: GiftOption[] }) => setGifts(d.gifts ?? []))
      .catch(() => setGifts([]))
      .finally(() => setGiftsState("done"));
  }, [unlocked, giftsState]);

  /**
   * Claim a gift: add the real Shopify variant to the cart so the Buy X Get Y
   * rule can discount it at checkout. Selecting alone would have been cosmetic
   * — the item has to actually be in the cart to be given away.
   * Guarded so a double-tap, or a click while the cart is mutating, can't add
   * the item twice.
   */
  const claimGift = (gift: GiftOption) => {
    if (busy || selectedGift || !gift.variantId) return;
    setSelectedGift(gift.handle);
    addVariant(gift.variantId, 1);
  };

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
                    <span className="font-semibold text-gold">
                      המתנה שלך נפתחה.
                    </span>{" "}
                    בחרי את הפריט שעל הבית למטה 🎁
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
                    והמתנה שלך תיפתח 🎁
                  </>
                )}
              </p>
              {/* Explicit step counter — reinforces exactly what's left */}
              <span className="flex-none rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-gold">
                {progress}/{GIFT_THRESHOLD}
              </span>
            </div>

            {/* Chunky track: fills from the start (right in RTL) toward the
                gift at the end, with a notch marking each step to the
                threshold. */}
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-platinum/50">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-gold via-[#D9BE7E] to-[#E6D2A6] transition-[width] duration-700 ease-cinematic"
                  style={{ width: `${(progress / GIFT_THRESHOLD) * 100}%` }}
                />
                {Array.from({ length: GIFT_THRESHOLD - 1 }, (_, i) => i + 1).map(
                  (i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 w-px bg-canvas/80"
                      style={{
                        insetInlineStart: `${(i / GIFT_THRESHOLD) * 100}%`,
                      }}
                    />
                  ),
                )}
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

        {/* Scrollable body — the shopper's own items come FIRST so they're
            visible the moment the drawer opens; the gift selection sits below
            them. */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto">
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
                  הכספת שלך ריקה כרגע. הוסיפי פריטים לאוסף שלך.
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
                          alt={`${item.title}, תכשיט מבית Oridor`}
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
                            {/* Material · chosen options, e.g.
                                "כסף 925 טהור בציפוי רודיום · 2 קראט".
                                Falls back to the raw variant title if the
                                product has no description to draw on. */}
                            {(item.details ?? item.variant) && (
                              <p className="mt-0.5 truncate text-[11px] font-light leading-snug text-ash">
                                {item.details ?? item.variant}
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

          {/* Gift options — collapses to zero height until the tier is reached.
              Premium cards: real product imagery, generous padding, a
              standout heading, and a clear gold selection state. */}
          {items.length > 0 && (
            <div
              className={`grid bg-cream/60 transition-all duration-700 ease-cinematic ${
                unlocked
                  ? "mt-2 grid-rows-[1fr] border-t border-platinum/50 opacity-100"
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

                  {giftsState === "loading" && (
                    <div className="flex justify-center py-8">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
                    </div>
                  )}

                  {giftsState === "done" && gifts.length === 0 && (
                    <p className="py-6 text-center text-[11px] font-light leading-relaxed text-ash">
                      המתנות יתעדכנו כאן בקרוב, ונצרף אותן להזמנה שלך.
                    </p>
                  )}

                  <div className="space-y-2.5">
                    {gifts.map((gift) => {
                      const { handle, title, image, price } = gift;
                      const active = selectedGift === handle;
                      // Once one gift is claimed the others are locked: the
                      // promotion grants a single free item.
                      const locked = selectedGift !== null && !active;
                      return (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => claimGift(gift)}
                          disabled={locked || busy}
                          aria-pressed={active}
                          className={`group relative flex w-full items-center gap-3.5 rounded-2xl border p-3 text-start transition-all duration-300 ease-cinematic ${
                            active
                              ? "scale-[1.015] border-gold bg-gold/[0.06] shadow-[0_14px_34px_-14px_rgba(197,160,89,0.55)] ring-1 ring-gold/40"
                              : locked
                                ? "cursor-not-allowed border-platinum/40 bg-canvas opacity-45"
                                : "border-platinum/60 bg-canvas shadow-card hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-cardHover"
                          }`}
                        >
                          {/* Product image — live from Shopify */}
                          <div className="relative h-[68px] w-[68px] flex-none overflow-hidden rounded-xl bg-cream">
                            {image && (
                              <Image
                                src={image}
                                alt={`${title}, מתנת פרימיום מבית Oridor`}
                                fill
                                sizes="68px"
                                className="object-cover transition-transform duration-500 ease-cinematic group-hover:scale-105"
                              />
                            )}
                          </div>

                          {/* Copy */}
                          <div className="min-w-0 flex-1">
                            <p className="text-[13.5px] font-medium leading-snug text-charcoal">
                              {title}
                            </p>
                            <p className="mt-0.5 text-[11px] font-light leading-snug text-ash">
                              שווי {formatPrice(price)}
                            </p>
                            <p className="mt-1.5 text-[10px] font-medium tracking-[0.12em] text-gold">
                              {active ? "✓ נוסף לסל" : "✦ לבחירת המתנה"}
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
                      המתנה נוספה לסל שלך ✓
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
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
