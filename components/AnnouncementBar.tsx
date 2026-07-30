"use client";

import { Fragment, useEffect, useState } from "react";

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
      <div className="mx-auto flex min-h-11 max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-6 py-2.5 text-center sm:px-12">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11.5px] leading-snug tracking-wide sm:text-[13px]">
          {/* Rose — standalone leading item so it pins to the visual start
              (right edge in RTL) rather than being reordered mid-line. */}
          <span aria-hidden="true" className="text-[15px] leading-none">
            🌹
          </span>
          {/* Headline — punchy bold offer, the gift word in gold */}
          <span className="font-semibold text-white">
            קני 2 תכשיטים והשלישי{" "}
            <span className="font-bold text-gold">במתנה</span>
          </span>
          <span aria-hidden="true" className="hidden text-gold/50 sm:inline">
            •
          </span>
          <span className="font-light text-white/85">משלוח חינם</span>
          <span aria-hidden="true" className="hidden text-gold/50 sm:inline">
            •
          </span>
          <span className="font-light text-white/85">
            כסף 925 בציפוי רודיום, לא משחיר
          </span>
        </p>
        <Countdown />
      </div>
    </div>
  );
}
