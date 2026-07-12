"use client";

import { Fragment, useEffect, useState } from "react";
import { X } from "lucide-react";

// Launch-sale deadline (Israel time). Update to extend the promotion.
const SALE_END = new Date("2026-07-31T23:59:59+03:00").getTime();

interface TimeLeft {
  d: number;
  h: number;
  m: number;
  s: number;
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, SALE_END - Date.now());
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor(diff / 3_600_000) % 24,
    m: Math.floor(diff / 60_000) % 60,
    s: Math.floor(diff / 1_000) % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Elegant Days/Hours/Minutes/Seconds counter. Client-only to avoid SSR drift. */
function Countdown() {
  const [t, setT] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setT(getTimeLeft());
    const id = window.setInterval(() => setT(getTimeLeft()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Render nothing until mounted so server and client markup match.
  if (!t) return null;

  const units: { v: number; l: string }[] = [
    { v: t.d, l: "ימים" },
    { v: t.h, l: "שע׳" },
    { v: t.m, l: "דק׳" },
    { v: t.s, l: "שנ׳" },
  ];

  return (
    <span
      className="inline-flex items-center gap-1.5"
      aria-label={`נותרו ${t.d} ימים ${t.h} שעות ${t.m} דקות`}
    >
      {units.map((u, i) => (
        <Fragment key={u.l}>
          <span className="inline-flex min-w-[1.75rem] flex-col items-center leading-none">
            <span className="text-[12px] font-semibold tabular-nums text-white">
              {pad(u.v)}
            </span>
            <span className="mt-0.5 text-[7px] uppercase tracking-[0.15em] text-white/50">
              {u.l}
            </span>
          </span>
          {i < units.length - 1 && (
            <span aria-hidden="true" className="text-white/50">
              :
            </span>
          )}
        </Fragment>
      ))}
    </span>
  );
}

/**
 * Premium top announcement bar — a sharp black strip that anchors the header
 * against the airy off-white site. White text for high contrast. Shows the
 * launch-sale promo + live countdown. Sits above the header; dismissible.
 */
export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative bg-black text-white">
      <div className="mx-auto flex min-h-10 max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-10 py-2 text-center sm:px-12">
        <p className="text-[11px] font-light leading-snug tracking-wide sm:text-xs">
          מבצע השקת הקולקציה
          <span className="mx-1.5 text-white/50">·</span>
          <span className="font-medium text-white">2+1 מתנה</span>
        </p>
        <Countdown />
      </div>
      <button
        type="button"
        aria-label="סגירת סרגל ההודעות"
        onClick={() => setDismissed(true)}
        className="absolute end-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center text-white/50 transition-colors hover:text-white"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
