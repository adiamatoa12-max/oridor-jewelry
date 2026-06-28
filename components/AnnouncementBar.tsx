"use client";

import { useState } from "react";
import { X } from "lucide-react";

/**
 * Thin top announcement bar — sits above the Navbar and scrolls away with the
 * page (not sticky). Pure white bar with delicate graphite text, dismissible
 * via a clean X icon.
 */
export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative border-b border-gray-100 bg-canvas text-gray-500">
      <p className="mx-auto max-w-7xl px-10 py-2.5 text-center text-xs font-light tracking-wide">
        משלוח חינם בהזמנות מעל ₪300
      </p>
      <button
        type="button"
        aria-label="סגירת הודעת המשלוח"
        onClick={() => setVisible(false)}
        className="absolute end-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-gray-400 transition-colors hover:text-graphite"
      >
        <X size={15} strokeWidth={1.5} />
      </button>
    </div>
  );
}
