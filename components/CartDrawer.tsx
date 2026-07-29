"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  Lock,
  ArrowLeft,
  Gift,
  Gem,
  ShieldCheck,
  Star,
  Tag,
  Sparkles,
  Crown,
} from "lucide-react";
import { useCart } from "./CartContext";
import { trackInitiateCheckout } from "@/lib/metaPixel";

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

// Mystery gift promo: add 2+ jewellery items and a free "מתנה בהפתעה" (mystery
// gift) is included in the package. A placeholder card is shown in the cart and
// a fulfillment flag is written to the Shopify cart so the order carries the
// instruction to pack the gift.
const GIFT_THRESHOLD = 2;

// Fulfillment flag written to the Shopify cart's custom attributes. It flows to
// the order (visible under the order's Additional details in Admin), so the
// store owner knows to include the free mystery gift in the package.
const MYSTERY_ATTR_KEY = "מתנה בהפתעה";
const MYSTERY_ATTR_VALUE = "יש לצרף מתנת הפתעה חינם לחבילה 🎁";

/**
 * Slide-out mini cart (RTL) — high-end boutique experience.
 * Overlay fades in; the panel slides from the left (inline-end in RTL). Kept
 * mounted so enter/exit both animate. A gift-progress bar (buy 2, 3rd free) sits on top,
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
    attributes,
    setAttributes,
    discountCodes,
  } = useCart();

  // Active club / welcome discount codes actually applied to the cart.
  const activeCodes = discountCodes.filter((d) => d.applicable);
  // The drawer stays mounted, so reset its scroll to the top each time it opens.
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) bodyRef.current?.scrollTo({ top: 0 });
  }, [isOpen]);

  // Mystery gift unlocks at 2+ items: a placeholder card is shown and the
  // fulfillment flag is written to the cart. `count` is Shopify's total quantity.
  const progress = Math.min(count, GIFT_THRESHOLD);
  const toGo = Math.max(1, GIFT_THRESHOLD - count);
  const unlocked = count >= GIFT_THRESHOLD;

  // Keep the Shopify cart's fulfillment flag in sync with eligibility: set it
  // once the shopper reaches the tier, clear it if the cart drops below. The ref
  // guards against firing twice before the mutation settles (mutations queue).
  const attrHasMystery = attributes.some((a) => a.key === MYSTERY_ATTR_KEY);
  const attrActionRef = useRef(false);
  useEffect(() => {
    if (busy || attrActionRef.current || !checkoutUrl) return;
    if (unlocked && !attrHasMystery) {
      attrActionRef.current = true;
      setAttributes([
        ...attributes.filter((a) => a.key !== MYSTERY_ATTR_KEY),
        { key: MYSTERY_ATTR_KEY, value: MYSTERY_ATTR_VALUE },
      ]);
    } else if (!unlocked && attrHasMystery) {
      attrActionRef.current = true;
      setAttributes(attributes.filter((a) => a.key !== MYSTERY_ATTR_KEY));
    }
  }, [unlocked, attrHasMystery, attributes, busy, checkoutUrl, setAttributes]);
  useEffect(() => {
    if (!busy) attrActionRef.current = false;
  }, [busy]);

  // Footer savings callout: the promo discount (the free item's value) plus any
  // per-line sale discounts.
  const totalSaved = items.reduce((sum, item) => {
    const onSale =
      item.compareAtPrice != null && item.compareAtPrice > item.price;
    const saleSaved = onSale
      ? (item.compareAtPrice! - item.price) * item.quantity
      : 0;
    return sum + item.promoDiscount + saleSaved;
  }, 0);

  // Subtotal comes straight from Shopify's cart cost, which already reflects the
  // automatic discount — the free item is ₪0 in this total, so no manual math.
  const displaySubtotal = subtotal;

  // Paid items first; any Shopify-discounted free line pinned last as a bonus.
  const orderedItems = [
    ...items.filter((it) => !it.isFree),
    ...items.filter((it) => it.isFree),
  ];

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

      {/* Drawer panel — anchored to the RIGHT (inline-start in RTL) and sliding
          in from the right, the standard side for Hebrew storefronts. */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="סל הקניות"
        className={`absolute start-0 top-0 flex h-full w-full max-w-md flex-col bg-canvas shadow-cardHover transition-transform duration-500 ease-cinematic ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header — clean, classic title + item count */}
        <div className="flex items-center justify-between border-b border-platinum/50 px-6 py-5">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-medium tracking-wide text-charcoal">
              סל הקניות
            </h2>
            <span className="text-sm font-light tabular-nums text-ash">
              ({count})
            </span>
          </div>
          <button
            type="button"
            aria-label="סגירת סל הקניות"
            onClick={closeCart}
            className="-me-2 inline-flex h-11 w-11 items-center justify-center text-charcoal transition-colors hover:text-graphite"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Gift progress (buy 2, 3rd free) — pinned directly under the header, OUTSIDE the scroll
            region, so how far the shopper is from the free gift stays visible
            no matter how long the cart gets. */}
        {items.length > 0 && (
          <div className="flex-none border-b border-platinum/60 bg-cream px-6 py-4 shadow-[0_6px_16px_-12px_rgba(31,31,31,0.4)]">
            <div className="flex items-center justify-between gap-3">
              {/* One tidy line — concise copy so it never wraps awkwardly */}
              <p className="min-w-0 flex-1 text-[13px] font-medium leading-snug text-charcoal">
                {unlocked ? (
                  <>
                    <span className="font-semibold text-gold">יש!</span>{" "}
                    מתנת ההפתעה שלך מצורפת לחבילה 🎁
                  </>
                ) : (
                  <>
                    עוד {toGo} {toGo === 1 ? "פריט" : "פריטים"} וקבלי מתנה בהפתעה
                    🎁
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
                  סל הקניות שלך ריק כרגע. הוסיפי פריטים לאוסף שלך.
                </p>
              )
            ) : (
              <ul className="divide-y divide-platinum/30">
                {orderedItems.map((item) => {
                  const isGift = item.isFree;
                  const onSale =
                    !isGift &&
                    item.compareAtPrice != null &&
                    item.compareAtPrice > item.price;
                  const saved = onSale
                    ? (item.compareAtPrice! - item.price) * item.quantity
                    : 0;
                  return (
                    <li
                      key={item.id}
                      className={`flex gap-4 py-5 ${isGift ? "rounded-2xl bg-gold/[0.05] px-3 ring-1 ring-gold/25" : ""}`}
                    >
                      {/* Product image (right in RTL) */}
                      <div className="relative aspect-square w-[84px] flex-none overflow-hidden rounded-xl bg-cream ring-1 ring-platinum/40">
                        <Image
                          src={item.image}
                          alt={`${item.title}, תכשיט מבית Oridor`}
                          fill
                          sizes="84px"
                          className="object-cover"
                        />
                        {isGift && (
                          <span className="absolute inset-x-0 bottom-0 bg-gold/90 py-0.5 text-center text-[9px] font-semibold tracking-[0.1em] text-[#0a0a0a]">
                            מתנה
                          </span>
                        )}
                      </div>

                      {/* Details + controls (left) */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-medium leading-snug text-charcoal">
                              {item.title}
                            </h3>
                            {isGift ? (
                              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-gold">
                                <Gift size={12} strokeWidth={2} />
                                התכשיט השלישי שלך · במתנה
                              </p>
                            ) : (
                              (item.details ?? item.variant) && (
                                <p className="mt-0.5 truncate text-[11px] font-light leading-snug text-ash">
                                  {item.details ?? item.variant}
                                </p>
                              )
                            )}
                          </div>
                          {/* Remove — available on every line, incl. the free
                              item (it's one of the shopper's own products). */}
                          <button
                            type="button"
                            aria-label={`הסרת ${item.title} מהעגלה`}
                            onClick={() => removeItem(item.id)}
                            className="-me-1.5 -mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full text-ash transition-colors hover:bg-platinum/20 hover:text-charcoal"
                          >
                            <X size={15} strokeWidth={1.5} />
                          </button>
                        </div>

                        {/* Price — gift shows ₪0 with the value struck through;
                            paid items show sale price in green when discounted. */}
                        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          {isGift ? (
                            <>
                              <span className="text-sm font-semibold text-emerald-600">
                                {formatPrice(0)}
                              </span>
                              <span className="text-xs font-light text-ash line-through">
                                {formatPrice(item.price)}
                              </span>
                              <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                                חינם
                              </span>
                            </>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>

                        {/* Bottom row — stepper for paid items; a quiet note for
                            the free promo item (no quantity controls). */}
                        {isGift ? (
                          <p className="mt-auto pt-3 text-[11px] font-light text-ash">
                            הפריט הזול בסל שלך — עלינו 🎁
                          </p>
                        ) : (
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
                        )}
                      </div>
                    </li>
                  );
                })}

                {/* Mystery gift — a placeholder promo card (not a Shopify line):
                    shown once the shopper reaches the tier. The real fulfillment
                    signal is the cart attribute written above; this card is the
                    shopper-facing "you've earned a free surprise" cue. */}
                {unlocked && (
                  <li className="flex gap-4 py-5">
                    {/* Wrapped-gift tile with a "?" to signal a surprise */}
                    <div className="relative flex aspect-square w-[84px] flex-none items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gold/25 via-gold/10 to-transparent ring-1 ring-gold/30">
                      <Gem size={30} strokeWidth={1.5} className="text-gold" />
                      <span className="absolute end-1.5 top-1.5 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gold text-[11px] font-bold text-[#0a0a0a]">
                        ?
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium leading-snug text-charcoal">
                          תכשיט במתנה בהפתעה 💎
                        </h3>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-gold">
                          <Sparkles size={12} strokeWidth={2} />
                          תכשיט כסף 925 מפנק במתנה מאיתנו, נבחר במיוחד עבורך ✨
                        </p>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-sm font-semibold text-emerald-600">
                          {formatPrice(0)}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                          חינם
                        </span>
                      </div>

                      <p className="mt-auto pt-3 text-[11px] font-light text-ash">
                        יצורף לחבילה שלך — הפתעה 🤍
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            )}
          </div>

        </div>

        {/* Footer: total + checkout — pinned (sticky) at the bottom, floating
            above the scroll region with a soft upward shadow. Pared back to the
            essentials: total figure, CTA, and trust signals. */}
        <div className="border-t border-platinum/50 bg-canvas px-6 py-6 shadow-[0_-10px_30px_rgba(31,31,31,0.05)]">
          {/* Highlighted savings callout — the full promotional discount on
              this order, so the value is unmistakable right before checkout. */}
          {totalSaved > 0 && (
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 ring-1 ring-emerald-600/15">
              <Tag size={15} strokeWidth={1.75} className="text-emerald-600" />
              <span className="text-[13px] font-semibold text-emerald-700">
                את חוסכת {formatPrice(totalSaved)} בהזמנה הזו
              </span>
            </div>
          )}

          {/* Active club / welcome discount — confirms the code is live */}
          {activeCodes.length > 0 && (
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-gold/10 px-4 py-2 ring-1 ring-gold/25">
              <Crown size={14} strokeWidth={1.75} className="text-gold" />
              <span className="text-[12px] font-medium text-charcoal">
                הנחת מועדון פעילה · {activeCodes[0].code}
              </span>
            </div>
          )}

          {/* Total — quiet label beside the figure */}
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-light tracking-wide text-ash">
              סה״כ לתשלום
            </span>
            <span className="text-2xl font-normal tracking-wide text-charcoal">
              {formatPrice(displaySubtotal)}
            </span>
          </div>

          {/* Social proof — a 5-star rating placed right by the CTA to lift
              confidence at the decision point. */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  strokeWidth={1}
                  className="fill-gold text-gold"
                />
              ))}
            </div>
            <span className="text-[11px] font-medium tracking-wide text-graphite">
              4.9 מתוך 5 · מאות לקוחות ממליצות
            </span>
          </div>

          <a
            href={checkoutUrl ?? "#"}
            aria-disabled={items.length === 0 || !checkoutUrl || busy}
            onClick={(e) => {
              if (items.length === 0 || !checkoutUrl || busy) {
                e.preventDefault();
                return;
              }
              // InitiateCheckout — the last event we own. Everything past this
              // link (payment, purchase) happens on Shopify's hosted checkout,
              // off our domain, and must be tracked Shopify-side. CartItem
              // carries no handle, so content_ids is omitted; value + num_items
              // are what Meta needs for checkout-abandonment audiences.
              trackInitiateCheckout({ value: displaySubtotal, numItems: count });
            }}
            className={`group mt-3 flex w-full items-center justify-center gap-2 bg-charcoal py-4 text-xs font-medium uppercase tracking-[0.2em] text-canvas transition-all duration-300 ease-cinematic hover:bg-gold hover:text-charcoal active:scale-[0.99] ${
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
