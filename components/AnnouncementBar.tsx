"use client";

import { Fragment, useEffect, useState } from "react";

// Launch-sale deadline (Israel time). Update to extend the promotion.
// Set so the countdown opens at 5 days out; days tick down naturally from there.
const SALE_END = new Date("2026-08-05T23:59:59+03:00").getTime();

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
      className="inline-flex items-center gap-1"
      aria-label={`נותרו ${t.d} ימים ${t.h} שעות ${t.m} דקות`}
    >
      {units.map((u, i) => (
        <Fragment key={u.l}>
          <span className="inline-flex flex-col items-center">
            {/* Sharp boxed digit — high contrast on the black bar */}
            <span className="min-w-[26px] rounded-[5px] bg-white/[0.12] px-1.5 py-1 text-center text-[13px] font-bold leading-none tabular-nums text-white ring-1 ring-white/15">
              {pad(u.v)}
            </span>
            <span className="mt-1 text-[7px] font-medium uppercase tracking-[0.14em] text-white/55">
              {u.l}
            </span>
          </span>
          {i < units.length - 1 && (
            <span
              aria-hidden="true"
              className="self-start py-1 text-[13px] font-bold leading-none text-gold"
            >
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
 * launch-sale promo + live countdown. Sits above the header and is always
 * visible — deliberately NOT dismissible, so the promo can't be hidden.
 */
export default function AnnouncementBar() {
  return (
    <div className="relative bg-black text-white shadow-[inset_0_-1px_0_rgba(197,160,89,0.35)]">
      <div className="mx-auto flex min-h-12 max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-6 py-2 text-center sm:px-12 sm:gap-x-7">
        {/* Promo copy — main offer with a refined secondary line beneath it */}
        <div className="flex flex-col items-center gap-y-1">
          <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 text-[11.5px] leading-snug tracking-wide sm:text-[13px]">
            {/* Diamond — standalone leading item so it pins to the visual start
                (right edge in RTL) rather than being reordered mid-line. */}
            <span aria-hidden="true" className="text-[14px] leading-none">
              💎
            </span>
            {/* Main offer — clean, sharp white */}
            <span className="font-semibold text-white">
              קני 2 פריטים וקבלי תכשיט שלישי במתנה
            </span>
          </p>
          {/* Secondary line — prominent gold material statement, the eye-catcher */}
          <p className="text-[12px] font-bold leading-none tracking-[0.12em] text-gold sm:text-[15px]">
            תכשיטי כסף 925 בציפוי רודיום
          </p>
        </div>
        <Countdown />
      </div>
    </div>
  );
}
