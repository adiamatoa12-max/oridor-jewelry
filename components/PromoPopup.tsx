"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import ClubSignup from "./ClubSignup";

/** sessionStorage flag so the popup auto-shows at most once per browsing session. */
const SEEN_KEY = "oridor-promo-seen";
/** Any element can open the popup on demand: window.dispatchEvent(new Event(PROMO_OPEN_EVENT)). */
export const PROMO_OPEN_EVENT = "oridor:open-promo";
/**
 * Auto-open pacing — the popup lets the visitor start browsing first, so it
 * opens on the FIRST of these engagement signals rather than on page load:
 *  - they scroll past SCROLL_TRIGGER_PX, or
 *  - FALLBACK_DELAY_MS passes (a gentle time-based fallback).
 * A hard MIN_DELAY_MS floor guarantees it never interrupts the first moment on
 * the site, even if the page loads already scrolled or the shopper scrolls fast.
 */
const SCROLL_TRIGGER_PX = 350;
const FALLBACK_DELAY_MS = 4000;
const MIN_DELAY_MS = 1500;

/**
 * VIP club welcome popup — a striking dark modal (ink + gold) inviting the
 * shopper to join the club for an instant 10% discount. The email capture,
 * discount activation and success state all live in <ClubSignup/>. Auto-opens
 * once per session on engagement; also opens on PROMO_OPEN_EVENT. Closes on the
 * ✕, the backdrop, Esc, or the dismiss link.
 */
export default function PromoPopup() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode / storage disabled — just don't persist */
    }
  }, []);

  // Auto-open once per session — engagement (scroll past SCROLL_TRIGGER_PX) or a
  // FALLBACK_DELAY_MS timer, whichever first, never before the MIN_DELAY_MS floor.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    let opened = false;
    let minElapsed = false;

    const openOnce = () => {
      if (opened) return;
      opened = true;
      setOpen(true);
      cleanup();
    };

    const onScroll = () => {
      if (minElapsed && window.scrollY >= SCROLL_TRIGGER_PX) openOnce();
    };

    const minTimer = window.setTimeout(() => {
      minElapsed = true;
      if (window.scrollY >= SCROLL_TRIGGER_PX) openOnce();
    }, MIN_DELAY_MS);
    const fallbackTimer = window.setTimeout(openOnce, FALLBACK_DELAY_MS);

    window.addEventListener("scroll", onScroll, { passive: true });

    function cleanup() {
      window.clearTimeout(minTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, []);

  // Manual trigger from anywhere (e.g. a "מבצעים" button) — reopens even if seen.
  useEffect(() => {
    const openNow = () => setOpen(true);
    window.addEventListener(PROMO_OPEN_EVENT, openNow);
    return () => window.removeEventListener(PROMO_OPEN_EVENT, openNow);
  }, []);

  // While open: Esc closes, body scroll is locked, focus moves into the modal.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

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
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl"
        />

        {/* Close */}
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="סגירה"
          className="absolute end-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-platinum/60 transition-colors duration-300 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="relative px-8 pb-11 pt-14 sm:px-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-gold">
            מועדון ה-VIP
          </p>

          <h2
            id="promo-title"
            className="font-display text-3xl font-semibold leading-snug text-cream sm:text-[34px]"
          >
            הצטרפי למועדון ה-VIP שלנו
          </h2>

          <p className="mx-auto mt-4 max-w-xs text-sm font-light leading-relaxed text-platinum/70">
            וקבלי 10% הנחה מיידית על כל המוצרים באתר + השתתפות אוטומטית בהגרלה על סט מואסנייט יוקרתי ✨
          </p>

          <div className="mt-8">
            <ClubSignup
              tone="dark"
              layout="stacked"
              ctaLabel="קבלי את ההנחה שלי"
              onSuccess={() => {
                try {
                  sessionStorage.setItem(SEEN_KEY, "1");
                } catch {
                  /* ignore */
                }
              }}
            />
          </div>

          <button
            type="button"
            onClick={close}
            className="mt-5 text-xs font-light tracking-wide text-platinum/50 underline decoration-platinum/30 underline-offset-4 transition-colors duration-300 hover:text-platinum hover:decoration-platinum/60"
          >
            אולי בפעם אחרת
          </button>
        </div>
      </div>
    </div>
  );
}
