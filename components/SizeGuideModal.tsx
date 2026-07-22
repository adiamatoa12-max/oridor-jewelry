"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// US ring sizing. Unlike EU (where the size IS the mm circumference), the US
// size is a scale number, so the shopper must match their measured mm to the
// table rather than read the size off the ruler directly.
const RING_SIZES = [
  { size: "6", circumference: "51.9", diameter: "16.5" },
  { size: "7", circumference: "54.4", diameter: "17.3" },
  { size: "8", circumference: "57.0", diameter: "18.1" },
  { size: "9", circumference: "59.5", diameter: "18.9" },
];

/**
 * Size-guide link that opens a clean, centered modal instead of navigating
 * away. Closes on the X, on a backdrop click, or with Escape. Portalled to the
 * body so its fixed positioning is never trapped by a transformed ancestor.
 */
export default function SizeGuideModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 inline-block text-start text-xs font-light tracking-wide text-graphite underline underline-offset-4 transition-colors hover:text-gold"
      >
        מדריך מידות טבעת: איך למדוד בבית
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="מדריך מידות טבעת"
          >
            {/* Backdrop — click to close */}
            <div
              className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-md rounded-xl bg-canvas p-6 text-right shadow-cardHover sm:p-8">
              <button
                type="button"
                aria-label="סגירת המדריך"
                onClick={() => setOpen(false)}
                className="absolute end-4 top-4 inline-flex h-9 w-9 items-center justify-center text-charcoal transition-colors hover:text-graphite"
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              <h3 className="text-xl font-medium tracking-wide text-charcoal">
                מדריך מידות טבעת
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
                כרכי חוט דק סביב בסיס האצבע ומדדי את ההיקף במילימטרים. השווי את המספר לטבלה שלמטה ובחרי את המידה המתאימה. אם את בין שתי מידות, בחרי את הגדולה יותר.
              </p>

              <div className="mt-6 overflow-hidden rounded-lg border border-platinum/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cream/50 text-[11px] uppercase tracking-wide text-ash">
                      <th className="px-4 py-2.5 font-medium">מידה</th>
                      <th className="px-4 py-2.5 font-medium">היקף (מ״מ)</th>
                      <th className="px-4 py-2.5 font-medium">קוטר (מ״מ)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-platinum/40 font-light text-graphite">
                    {RING_SIZES.map((r) => (
                      <tr key={r.size}>
                        <td className="px-4 py-2.5 font-medium text-charcoal">{r.size}</td>
                        <td className="px-4 py-2.5">{r.circumference}</td>
                        <td className="px-4 py-2.5">{r.diameter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs font-light text-ash">
                טיפ: מדדי בסוף היום, כשהאצבעות בהיקף המרבי שלהן.
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
