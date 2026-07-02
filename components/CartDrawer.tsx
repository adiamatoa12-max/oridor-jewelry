"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, Package, Gem, Sparkles, Check, Lock, ArrowLeft } from "lucide-react";
import { useCart } from "./CartContext";
import VaultReward3D from "./VaultReward3D";

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

// VIP Vault gift promotion.
const VAULT_THRESHOLD = 500;
const GIFTS = [
  { id: "travel-box", label: "קופסת תכשיטים לנסיעות", Icon: Package },
  { id: "studs", label: "עגילי צמוד קלאסיים", Icon: Gem },
  { id: "care-kit", label: "ערכת טיפוח לתכשיטים", Icon: Sparkles },
] as const;

/**
 * Slide-out mini cart (RTL).
 * Overlay fades in; the panel slides from the left (inline-end in RTL). Kept
 * mounted so enter/exit both animate. Crisp white panel, graphite typography.
 */
export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, count, updateQuantity, removeItem } =
    useCart();
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  const unlocked = subtotal >= VAULT_THRESHOLD;
  const remaining = Math.max(0, VAULT_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / VAULT_THRESHOLD) * 100);

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Dark backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-[#1a1a1a]/40 backdrop-blur-[2px] transition-opacity duration-500 ease-cinematic ${
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
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
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

        {/* VIP Vault — progress + gift selector */}
        {items.length > 0 && (
          <div className="border-b border-gray-200 bg-cream/60 px-6 py-4">
            <p className="text-xs font-light leading-relaxed tracking-wide text-charcoal">
              {unlocked ? (
                <>
                  <span className="font-medium text-gold">כספת ה-VIP נפתחה!</span>{" "}
                  בחרי את מתנת הפרימיום שלך — עלינו ✨
                </>
              ) : (
                <>
                  עוד{" "}
                  <span className="font-medium text-charcoal">
                    {formatPrice(remaining)}
                  </span>{" "}
                  ותקבלי מתנת פרימיום חינם 🎁
                </>
              )}
            </p>

            {/* Progress track — neutral while filling, gold→champagne when unlocked */}
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-platinum/40">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-cinematic ${
                  unlocked
                    ? "bg-gradient-to-r from-gold to-[#E6D2A6]"
                    : "bg-graphite/70"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 3D vault reward — the robot presents the chosen gift */}
            <VaultReward3D show={unlocked && isOpen} selectedGift={selectedGift} />

            {/* Gift options — smooth height + fade reveal once unlocked */}
            <div
              className={`grid transition-all duration-700 ease-cinematic ${
                unlocked ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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
                          strokeWidth={1.25}
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

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm font-light leading-relaxed text-ash">
              הכספת שלך ריקה כרגע —<br />הוסיפי פריטים לאוסף שלך.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex gap-5 py-7">
                  {/* Square image */}
                  <div className="relative aspect-square w-24 flex-none overflow-hidden rounded-sm bg-gray-50">
                    <Image
                      src={item.image}
                      alt={`${item.title} — תכשיט כסף מבית Oridor`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details + controls */}
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-sm font-normal leading-snug text-charcoal">{item.title}</h3>
                    {item.variant && (
                      <p className="mt-1 text-xs font-light text-ash">{item.variant}</p>
                    )}
                    <p className="mt-1.5 text-sm font-light text-graphite">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-gray-200">
                        <button
                          type="button"
                          aria-label="הפחתת כמות"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="inline-flex h-9 w-9 items-center justify-center text-charcoal transition-colors hover:bg-gray-50 disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} strokeWidth={1.5} />
                        </button>
                        <span className="min-w-8 text-center text-sm text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="הוספת כמות"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="inline-flex h-9 w-9 items-center justify-center text-charcoal transition-colors hover:bg-gray-50"
                        >
                          <Plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-gray-400 underline underline-offset-2 transition-colors hover:text-gray-600"
                      >
                        הסר
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer: subtotal + checkout */}
        <div className="border-t border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <span className="text-sm tracking-wide text-graphite">סך הכל הביניים</span>
            <span className="text-base font-normal text-charcoal">
              {formatPrice(subtotal)}
            </span>
          </div>
          <p className="mt-3 text-center text-xs font-light text-ash">
            משלוח חינם עד הבית מתווסף אוטומטית
          </p>
          <button
            type="button"
            className="group mt-5 flex w-full items-center justify-center gap-2 bg-[#2B2C2F] py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 ease-cinematic hover:bg-[#1a1b1c] hover:shadow-[0_10px_28px_rgba(43,44,47,0.35)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
            disabled={items.length === 0}
          >
            מעבר לקופה
            <ArrowLeft
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
          </button>
        </div>
      </aside>
    </div>
  );
}
