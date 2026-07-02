"use client";

import { useEffect, useRef, useState } from "react";
import {
  Accessibility,
  X,
  AArrowUp,
  AArrowDown,
  Contrast,
  Droplet,
  Link2,
  BookOpenText,
  RotateCcw,
} from "lucide-react";

const FONT_STEPS = [100, 110, 120, 135, 150];

/**
 * Lightweight, self-contained accessibility widget (RTL).
 * A discreet floating button opens a panel with common a11y controls — text
 * sizing, high contrast, grayscale, link highlighting and a readable font.
 * All changes are applied to <html> so the whole site responds; no external
 * dependencies. Respects Escape-to-close and keyboard focus.
 */
export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [fontIdx, setFontIdx] = useState(0);
  const [contrast, setContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [links, setLinks] = useState(false);
  const [readable, setReadable] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Apply visual filters + font scaling to the document root.
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = fontIdx === 0 ? "" : `${FONT_STEPS[fontIdx]}%`;
    const filters = [
      grayscale ? "grayscale(100%)" : "",
      contrast ? "contrast(1.4)" : "",
    ]
      .filter(Boolean)
      .join(" ");
    root.style.filter = filters;
    root.classList.toggle("a11y-links", links);
    root.classList.toggle("a11y-readable", readable);
  }, [fontIdx, contrast, grayscale, links, readable]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const reset = () => {
    setFontIdx(0);
    setContrast(false);
    setGrayscale(false);
    setLinks(false);
    setReadable(false);
  };

  const toggleClass = (active: boolean) =>
    `flex items-center gap-3 rounded-sm border px-4 py-3 text-start text-sm font-light transition-all duration-300 ${
      active
        ? "border-gold bg-gold/10 text-charcoal"
        : "border-platinum/50 bg-canvas text-graphite hover:border-gold/60"
    }`;

  return (
    <>
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="אפשרויות נגישות"
        aria-hidden={!open}
        className={`fixed bottom-24 right-5 z-50 w-72 origin-bottom-right rounded-md border border-platinum/50 bg-canvas p-5 shadow-cardHover transition-all duration-300 ease-cinematic ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-normal tracking-wide text-charcoal">נגישות</h2>
          <button
            type="button"
            aria-label="סגירת תפריט הנגישות"
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center text-graphite transition-colors hover:text-charcoal"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Text size */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setFontIdx((i) => Math.min(i + 1, FONT_STEPS.length - 1))}
              className={toggleClass(fontIdx > 0) + " flex-1 justify-center"}
              aria-label="הגדלת גודל הטקסט"
            >
              <AArrowUp size={18} strokeWidth={1.5} /> הגדלה
            </button>
            <button
              type="button"
              onClick={() => setFontIdx((i) => Math.max(i - 1, 0))}
              className={toggleClass(false) + " flex-1 justify-center"}
              aria-label="הקטנת גודל הטקסט"
            >
              <AArrowDown size={18} strokeWidth={1.5} /> הקטנה
            </button>
          </div>

          <button type="button" onClick={() => setContrast((v) => !v)} aria-pressed={contrast} className={toggleClass(contrast) + " w-full"}>
            <Contrast size={18} strokeWidth={1.5} /> ניגודיות גבוהה
          </button>
          <button type="button" onClick={() => setGrayscale((v) => !v)} aria-pressed={grayscale} className={toggleClass(grayscale) + " w-full"}>
            <Droplet size={18} strokeWidth={1.5} /> גווני אפור
          </button>
          <button type="button" onClick={() => setLinks((v) => !v)} aria-pressed={links} className={toggleClass(links) + " w-full"}>
            <Link2 size={18} strokeWidth={1.5} /> הדגשת קישורים
          </button>
          <button type="button" onClick={() => setReadable((v) => !v)} aria-pressed={readable} className={toggleClass(readable) + " w-full"}>
            <BookOpenText size={18} strokeWidth={1.5} /> פונט קריא
          </button>

          <button
            type="button"
            onClick={reset}
            className="mt-1 flex w-full items-center justify-center gap-2 border-t border-platinum/40 pt-3 text-xs font-light tracking-wide text-ash transition-colors hover:text-charcoal"
          >
            <RotateCcw size={14} strokeWidth={1.5} /> איפוס הגדרות
          </button>
        </div>
      </div>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="פתיחת תפריט נגישות"
        aria-expanded={open}
        className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-canvas shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-300 ease-cinematic hover:-translate-y-1 hover:bg-[#1a1b1c]"
      >
        <Accessibility size={26} strokeWidth={1.5} className="text-gold" />
      </button>
    </>
  );
}
