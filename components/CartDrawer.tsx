"use client";

import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "./CartContext";

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * Slide-out mini cart (RTL).
 * Overlay fades in; the panel slides from the left (inline-end in RTL). Kept
 * mounted so enter/exit both animate. Crisp white panel, graphite typography.
 */
export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, count, updateQuantity, removeItem } =
    useCart();

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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2 className="text-base font-normal tracking-wide text-charcoal">
            הסל שלך <span className="text-ash">({count})</span>
          </h2>
          <button
            type="button"
            aria-label="סגירת עגלת הקניות"
            onClick={closeCart}
            className="-me-2 inline-flex h-11 w-11 items-center justify-center text-charcoal transition-colors hover:text-graphite"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm font-light text-ash">
              הסל שלך ריק.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-6">
                  {/* Square image */}
                  <div className="relative aspect-square w-24 flex-none overflow-hidden bg-gray-50">
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
                    <h3 className="text-sm font-normal text-charcoal">{item.title}</h3>
                    {item.variant && (
                      <p className="mt-0.5 text-xs font-light text-ash">{item.variant}</p>
                    )}
                    <p className="mt-1 text-sm font-light text-graphite">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-3">
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
            className="mt-5 w-full bg-[#2B2C2F] py-4 text-sm tracking-wide text-white transition-colors duration-300 hover:bg-[#1a1b1c] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={items.length === 0}
          >
            מעבר לקופה
          </button>
        </div>
      </aside>
    </div>
  );
}
