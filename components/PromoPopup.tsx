"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

/** sessionStorage flag so the popup auto-shows at most once per browsing session. */
const SEEN_KEY = "oridor-promo-seen";
/** Any element can open the popup on demand: window.dispatchEvent(new Event(PROMO_OPEN_EVENT)). */
export const PROMO_OPEN_EVENT = "oridor:open-promo";
/** Delay before the auto-open, so it doesn't slam the visitor on first paint. */
const AUTO_OPEN_DELAY_MS = 1600;
/** Where "כן, אני רוצה!" sends the shopper — the offer. */
const OFFER_HREF = "/shop";

/**
 * Promotional popup — a clean, responsive modal on the dark brand surface
 * (ink + gold, Cormorant/Frank Ruhl heading). Auto-opens once per session and
 * can also be opened by dispatching PROMO_OPEN_EVENT from any button. Closes on
 * the ✕, the backdrop, Esc, or "לא תודה". Mounted once, globally, in the layout.
 */
export default function PromoPopup() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const primaryRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode / storage disabled — just don't persist */
    }
  }, []);

  // Auto-open once per session, after a short delay.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    const t = window.setTimeout(() => setOpen(true), AUTO_OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Manual trigger from anywhere (e.g. a "מבצעים" button) — reopens even if seen.
  useEffect(() => {
    const openNow = () => setOpen(true);
    window.addEventListener(PROMO_OPEN_EVENT, openNow);
    return () => window.removeEventListener(PROMO_OPEN_EVENT, openNow);
  }, []);

  // While open: Esc closes, body scroll is locked, focus moves to the CTA.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    primaryRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  const accept = () => {
    close();
    router.push(OFFER_HREF);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
      dir="rtl"
    >
      {/* Backdrop — dim + blur, click to dismiss. */}
      <button
        type="button"
        aria-label="סגירת החלון"
        onClick={close}
        className="absolute inset-0 animate-fade cursor-default bg-black/70 backdrop-blur-sm"
      />

      {/* Card — striking dark surface with a soft gold glow. */}
      <div className="relative w-full max-w-md animate-pop-in overflow-hidden rounded-2xl bg-ink text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        {/* Gold glow behind the heading for the "striking background" feel. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl"
        />

        {/* Close */}
        <button
          type="button"
          onClick={close}
          aria-label="סגירה"
          className="absolute end-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-platinum/60 transition-colors duration-300 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="relative px-8 pb-11 pt-14 sm:px-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-gold">
            מבצע השקה
          </p>

          <h2
            id="promo-title"
            className="font-display text-3xl font-semibold leading-snug text-cream sm:text-[34px]"
          >
            יש מבצע מיוחד באתר!
            <br />
            רוצה לגלות אותו?
          </h2>

          <p className="mx-auto mt-4 max-w-xs text-sm font-light leading-relaxed text-platinum/70">
            קנה 2 פריטים וקבל תכשיט שלישי במתנה — לזמן מוגבל בלבד.
          </p>

          <div className="mt-9 flex flex-col items-center gap-4">
            <button ref={primaryRef} type="button" onClick={accept} className="btn-gold w-full">
              כן, אני רוצה!
            </button>
            <button
              type="button"
              onClick={close}
              className="text-xs font-light tracking-wide text-platinum/50 underline decoration-platinum/30 underline-offset-4 transition-colors duration-300 hover:text-platinum hover:decoration-platinum/60"
            >
              לא תודה, אשלם מחיר מלא
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
