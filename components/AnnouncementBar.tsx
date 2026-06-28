"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Auto-cycling promo messages.
const MESSAGES = [
  "משלוח חינם לכל הארץ בהזמנות מעל ₪300 🚚",
  "תכשיטי מואסניט באיכות פרימיום — משלוח מהיר! ✨",
  "מלאי מוגבל: הקולקציה החדשה נחטפת! 🔥",
];

const INTERVAL = 4000;
const FADE = 600;

/**
 * Thin top announcement bar — sits above the Navbar (not sticky). Pure white
 * bar with delicate graphite text that auto-cycles between promo messages with
 * a smooth fade in/out. Dismissible via a clean X icon.
 */
export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const id = window.setInterval(() => {
      if (reduce) {
        setIndex((i) => (i + 1) % MESSAGES.length);
        return;
      }
      // Fade out, swap message, fade back in.
      setShown(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setShown(true);
      }, FADE);
    }, INTERVAL);

    return () => window.clearInterval(id);
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative border-b border-gray-100 bg-canvas text-gray-500">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-12">
        <p
          aria-live="polite"
          className={`text-center text-xs font-light tracking-wide transition-opacity duration-500 ease-in-out ${
            shown ? "opacity-100" : "opacity-0"
          }`}
        >
          {MESSAGES[index]}
        </p>
      </div>
      <button
        type="button"
        aria-label="סגירת הודעת המשלוח"
        onClick={() => setDismissed(true)}
        className="absolute end-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-gray-400 transition-colors hover:text-graphite"
      >
        <X size={15} strokeWidth={1.5} />
      </button>
    </div>
  );
}
