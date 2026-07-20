"use client";

import { useState } from "react";

/**
 * Local, config-driven size selector. Renders a pill per available size (from
 * the product page's sizeConfig) and tracks the chosen one. Purely presentational
 * for now — it needs no Shopify/DB wiring — matching the buy box's pill styling.
 */
export default function SizeSelector({ sizes }: { sizes: string[] }) {
  const [selected, setSelected] = useState(sizes[0]);
  if (!sizes.length) return null;

  // Any descriptive option in the set switches the whole group to stacked rows,
  // so the choices stay visually parallel rather than mixing pills and blocks.
  const longLabels = sizes.some((s) => s.length > 8);

  // A single option (e.g. "One Size") isn't a real choice — render it as a
  // quiet outlined chip rather than a heavy filled button, so it reads as
  // information, not a call to action.
  const single = sizes.length === 1;

  if (single) {
    return (
      <div className="mt-7">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ash">מידה</p>
        <span className="inline-flex min-h-[40px] items-center rounded-full border border-platinum/70 bg-transparent px-5 text-xs tracking-wide text-graphite">
          {sizes[0]}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-7">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ash">
        מידה
        <span className="ms-2 tracking-normal text-charcoal">{selected}</span>
      </p>
      <div className={longLabels ? "flex flex-col gap-2.5" : "flex flex-wrap gap-2.5"}>
        {sizes.map((size) => {
          const on = selected === size;
          return (
            <button
              key={size}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(size)}
              className={`min-h-[42px] border text-xs tracking-wide transition-all duration-300 ease-out ${
                // Descriptive options ("40 ס״מ + 5 ס״מ הארכה") are sentences, not
                // tokens: as pills they'd wrap mid-phrase on a 375px screen. They
                // get full-width rows instead; short tokens keep the compact pills.
                longLabels
                  ? "w-full rounded-xl px-5 py-3 text-start leading-relaxed"
                  : "min-w-[46px] rounded-full px-4"
              } ${
                on
                  ? "border-charcoal bg-charcoal text-canvas"
                  : "border-platinum/70 bg-canvas text-graphite hover:border-charcoal/50 hover:text-charcoal"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Scarcity nudge — subtle, informative, never aggressive */}
      <p className="mt-3 text-[11px] font-light text-ash">
        נותרו פריטים אחרונים במלאי למידה זו
      </p>
    </div>
  );
}
