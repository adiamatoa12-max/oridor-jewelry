"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
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
      {/* Backdrop — deep dim + soft blur, click to dismiss. */}
      <button
        type="button"
        aria-label="סגירת החלון"
        onClick={close}
        className="absolute inset-0 animate-fade cursor-default bg-black/70 backdrop-blur-sm"
      />

      {/* Card — a full-bleed jewellery-model photo behind a dark overlay, framed
          by a fine gold hairline. White copy sits over the darkened image for a
          high-end editorial look. */}
      <div className="relative w-full max-w-md animate-pop-in overflow-hidden rounded-[28px] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.85)] ring-1 ring-gold/30">
        {/* Full-size model background (cover, centred) */}
        <Image
          src="/photo/popup-model.png"
          alt=""
          fill
          priority
          sizes="448px"
          className="object-cover object-center"
        />
        {/* Dark overlay for text readability — a flat dim plus a bottom-weighted
            gradient so the form area stays crisp and legible. */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/70"
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
          className="absolute end-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white/85 backdrop-blur-sm transition-all duration-300 hover:border-gold/60 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        {/* Content — centred and generously padded over the darkened image.
            (Crown crest + "מועדון ה-VIP" eyebrow intentionally removed; the
            model portrait shows through cleanly where they were.) */}
        <div className="relative px-8 pb-11 pt-14 text-center sm:px-10">
          <h2
            id="promo-title"
            className="font-display text-[31px] font-semibold leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-[35px]"
          >
            הצטרפי למועדון ה-VIP שלנו
          </h2>

          {/* Short gold divider with a centre diamond accent */}
          <span
            aria-hidden="true"
            className="mx-auto mt-5 flex items-center justify-center gap-2"
          >
            <span className="h-px w-10 bg-gradient-to-l from-gold/70 to-transparent" />
            <span className="h-1 w-1 rotate-45 bg-gold" />
            <span className="h-px w-10 bg-gradient-to-r from-gold/70 to-transparent" />
          </span>

          {/* Subtext — two clean lines: the discount, then the sweepstakes */}
          <div className="mx-auto mt-5 max-w-[19rem] space-y-1.5 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
            <p className="text-[14px] font-light leading-[1.6] text-white/90">
              קבלי <span className="font-semibold text-gold">10% הנחה מיידית</span> על כל המוצרים באתר
            </p>
            <p className="text-[13px] font-light leading-[1.6] text-white/70">
              + השתתפות אוטומטית בהגרלה על סט מואסנייט יוקרתי ✨
            </p>
          </div>

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
            className="mt-6 text-[11px] font-light tracking-[0.05em] text-white/60 underline decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/60"
          >
            אולי בפעם אחרת
          </button>
        </div>
      </div>
    </div>
  );
}
