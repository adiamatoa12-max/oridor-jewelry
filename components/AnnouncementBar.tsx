"use client";

import { useEffect, useState } from "react";
import { X, Truck, Clock, Check } from "lucide-react";

const COUPON = "ORIDOR10";
const INTERVAL = 4000;
const FADE = 600;

/** ms remaining until the next local midnight — a rolling daily "flash sale". */
function msUntilMidnight() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return end.getTime() - now.getTime();
}

function format(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/**
 * Conversion announcement bar — sits above the Navbar (not sticky). Thin,
 * elegant charcoal bar with gold accents: a rolling flash-sale countdown, a
 * click-to-copy coupon code, and a reassuring returns message. On desktop the
 * three live side-by-side; on mobile they rotate with a soft fade.
 */
export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  // Mobile rotation
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(true);

  // Live countdown (client-only to avoid hydration mismatch).
  useEffect(() => {
    setRemaining(msUntilMidnight());
    const id = window.setInterval(() => setRemaining(msUntilMidnight()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Mobile fade rotation across the three segments.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(() => {
      if (reduce) {
        setIndex((i) => (i + 1) % 3);
        return;
      }
      setShown(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % 3);
        setShown(true);
      }, FADE);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(COUPON);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  if (dismissed) return null;

  const countdown = (
    <span className="inline-flex items-center gap-1.5">
      <Clock size={13} strokeWidth={1.5} className="text-gold" />
      <span>מבצע הבזק מסתיים בעוד</span>
      <span dir="ltr" className="font-mono tracking-wider text-gold tabular-nums">
        {remaining === null ? "--:--:--" : format(remaining)}
      </span>
    </span>
  );

  const coupon = (
    <button
      type="button"
      onClick={copyCoupon}
      className="group inline-flex items-center gap-2 transition-colors hover:text-canvas"
      aria-label={`העתקת קוד קופון ${COUPON}`}
    >
      <span>10% הנחה עם קוד</span>
      <span className="inline-flex items-center gap-1 border border-gold/60 px-2 py-0.5 font-semibold tracking-[0.15em] text-gold transition-colors group-hover:border-gold group-hover:bg-gold/10">
        {copied ? (
          <>
            <Check size={12} strokeWidth={2} /> הועתק!
          </>
        ) : (
          COUPON
        )}
      </span>
    </button>
  );

  const reassurance = (
    <span className="inline-flex items-center gap-1.5">
      <Truck size={14} strokeWidth={1.5} className="text-gold" />
      <span>החזרות עם שליח עד הבית</span>
    </span>
  );

  const segments = [reassurance, coupon, countdown];

  return (
    <div className="relative bg-charcoal text-[11px] font-light tracking-wide text-platinum">
      {/* Desktop: three segments side-by-side */}
      <div className="mx-auto hidden h-9 max-w-7xl items-center justify-between px-12 md:flex">
        {reassurance}
        {coupon}
        {countdown}
      </div>

      {/* Mobile: rotating single segment */}
      <div className="flex h-9 items-center justify-center px-10 md:hidden">
        <div
          aria-live="polite"
          className={`transition-opacity duration-500 ease-in-out ${
            shown ? "opacity-100" : "opacity-0"
          }`}
        >
          {segments[index]}
        </div>
      </div>

      <button
        type="button"
        aria-label="סגירת סרגל המבצע"
        onClick={() => setDismissed(true)}
        className="absolute end-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center text-platinum/60 transition-colors hover:text-canvas"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
