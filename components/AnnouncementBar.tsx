"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const INTERVAL = 5000;
const FADE = 600;

// Elegant, rotating promo lines. The VIP Vault leads.
const MESSAGES: { text: string; accent?: string }[] = [
  {
    accent: "The VIP Vault:",
    text: " קני מעל ₪499 ופתחי את כספת המתנות שלנו לבחירתך.",
  },
  { accent: "ORIDOR10", text: " — 10% הנחה עם הקוד" },
  { text: "החזרות עם שליח עד הבית" },
];

/**
 * Thin, elegant top announcement bar — light background, dark text. Sits above
 * the Navbar (not sticky) and gently fades between premium promo lines, led by
 * the VIP Vault gift promotion. Dismissible.
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
      setShown(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setShown(true);
      }, FADE);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  if (dismissed) return null;

  const msg = MESSAGES[index];

  return (
    <div className="relative border-b border-platinum/50 bg-cream text-charcoal">
      <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-center px-10 py-1.5 sm:px-12">
        <p
          aria-live="polite"
          className={`text-center text-[10px] font-light leading-snug tracking-wide transition-opacity duration-500 ease-in-out sm:text-[11px] ${
            shown ? "opacity-100" : "opacity-0"
          }`}
        >
          {msg.accent && (
            <span className="font-medium tracking-[0.12em] text-gold">{msg.accent}</span>
          )}
          {msg.text}
        </p>
      </div>
      <button
        type="button"
        aria-label="סגירת סרגל ההודעות"
        onClick={() => setDismissed(true)}
        className="absolute end-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center text-graphite/60 transition-colors hover:text-charcoal"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
