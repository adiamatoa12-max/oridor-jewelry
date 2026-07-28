"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Crown } from "lucide-react";
import ClubSignup from "./ClubSignup";

/** sessionStorage flag so the popup auto-shows at most once per browsing session. */
const SEEN_KEY = "oridor-promo-seen";
/** Any element can open the popup on demand: window.dispatchEvent(new Event(PROMO_OPEN_EVENT)). */
export const PROMO_OPEN_EVENT = "oridor:open-promo";
/**
 * Auto-open pacing — the popup NEVER interrupts on entry. A hard 15-second floor
 * means nothing opens before then; at 15s it opens (or the moment the shopper
 * scrolls past SCROLL_TRIGGER_PX once the floor has elapsed). Shown at most once
 * per session (SEEN_KEY in sessionStorage).
 */
const SCROLL_TRIGGER_PX = 350;
const FALLBACK_DELAY_MS = 15000;
const MIN_DELAY_MS = 15000;

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

      {/* Card — a boutique-jewelry modal: deep ink surface, a hairline gold
          frame, and a warm gold glow behind the crest. */}
      <div className="relative w-full max-w-md animate-pop-in overflow-hidden rounded-[26px] bg-gradient-to-b from-[#141210] to-ink text-center shadow-[0_40px_100px_-24px_rgba(0,0,0,0.75)] ring-1 ring-gold/25">
        {/* Warm gold glow behind the crest */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl"
        />
        {/* Thin gold top accent line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/70 to-transparent"
        />

        {/* Close — visible, generous tap target on mobile + desktop */}
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="סגירה"
          className="absolute end-3.5 top-3.5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-platinum/80 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:bg-white/10 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        <div className="relative px-8 pb-11 pt-12 sm:px-10">
          {/* Crest — a gold crown in a ringed circle for the boutique feel */}
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/12 ring-1 ring-gold/30">
            <Crown size={24} strokeWidth={1.5} className="text-gold" />
          </span>

          <p className="mt-5 text-[11px] uppercase tracking-[0.38em] text-gold/90">
            מועדון ה-VIP
          </p>

          <h2
            id="promo-title"
            className="mt-3 font-display text-[30px] font-semibold leading-[1.15] tracking-tight text-cream sm:text-[34px]"
          >
            הצטרפי למועדון ה-VIP שלנו
          </h2>

          {/* Short gold divider */}
          <span
            aria-hidden="true"
            className="mx-auto mt-5 block h-px w-14 bg-gradient-to-l from-transparent via-gold/60 to-transparent"
          />

          <p className="mx-auto mt-5 max-w-xs text-[13.5px] font-light leading-[1.75] text-platinum/75">
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
            className="mt-6 text-[11px] font-light tracking-[0.05em] text-platinum/45 underline decoration-platinum/25 underline-offset-4 transition-colors duration-300 hover:text-platinum/80 hover:decoration-platinum/50"
          >
            אולי בפעם אחרת
          </button>
        </div>
      </div>
    </div>
  );
}
