"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { buildUnifiedCatalog } from "@/lib/catalog";
import PriceTag from "./PriceTag";

const MAX_RESULTS = 8;

/**
 * Site search — a clean top-sheet overlay. Typing filters the unified catalog
 * by product name (Hebrew, accent/case-insensitive) and shows the matches with
 * image, price and collection, each linking to its product page. Closes on the
 * X, a backdrop click, or Escape. Portalled to <body> so its fixed positioning
 * is never trapped by a transformed ancestor.
 */
export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build the search index once (pure function over the local catalog).
  const catalog = useMemo(() => buildUnifiedCatalog(), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  const q = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      q
        ? catalog
            .filter((p) => p.title.toLowerCase().includes(q))
            .slice(0, MAX_RESULTS)
        : [],
    [q, catalog],
  );

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center px-4 py-4 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-label="חיפוש באתר"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 mt-[7vh] w-full max-w-2xl overflow-hidden rounded-xl bg-canvas shadow-cardHover">
        {/* Search input row */}
        <div className="flex items-center gap-3 border-b border-platinum/50 px-5 py-4 sm:px-6">
          <Search size={18} strokeWidth={1.5} className="flex-none text-ash" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            dir="rtl"
            placeholder="חיפוש תכשיטים…"
            className="flex-1 bg-transparent text-right text-base font-light text-charcoal placeholder:text-ash focus:outline-none"
          />
          <button
            type="button"
            aria-label="סגירת החיפוש"
            onClick={onClose}
            className="-me-1.5 inline-flex h-9 w-9 flex-none items-center justify-center text-charcoal transition-colors hover:text-graphite"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[62vh] overflow-y-auto">
          {q === "" ? (
            <p className="px-6 py-10 text-center text-sm font-light text-ash">
              הקלידי שם פריט כדי לחפש בקולקציה
            </p>
          ) : results.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm font-light text-ash">
              לא נמצאו תוצאות עבור &quot;{query.trim()}&quot;
            </p>
          ) : (
            <ul className="divide-y divide-platinum/30">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={p.href}
                    onClick={onClose}
                    className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-cream/50 sm:px-6"
                  >
                    <div className="relative h-14 w-14 flex-none overflow-hidden rounded-md bg-canvas">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="56px"
                        className={`${
                          p.fit === "cover" ? "object-cover" : "object-contain p-1"
                        } object-center`}
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-right">
                      <p className="truncate text-sm font-normal text-charcoal transition-colors group-hover:text-gold">
                        {p.title}
                      </p>
                      <p className="mt-0.5 text-[11px] font-light text-ash">
                        {p.collection}
                      </p>
                    </div>
                    <PriceTag
                      price={p.price}
                      compareAt={p.compareAtPrice}
                      className="flex-none"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
