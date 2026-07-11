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

  return (
    <div className="mt-7">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ash">
        מידה
        <span className="ms-2 tracking-normal text-charcoal">{selected}</span>
      </p>
      <div className="flex flex-wrap gap-2.5">
        {sizes.map((size) => {
          const on = selected === size;
          return (
            <button
              key={size}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(size)}
              className={`min-h-[42px] min-w-[46px] rounded-full border px-4 text-xs tracking-wide transition-all duration-300 ease-out ${
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
    </div>
  );
}
