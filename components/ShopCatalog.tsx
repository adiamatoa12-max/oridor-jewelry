"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import {
  buildUnifiedCatalog,
  SHOP_CHIPS,
  type Chip,
  type CatalogProduct,
} from "@/lib/catalog";

function matches(p: CatalogProduct, chip: Chip): boolean {
  if (chip.kind === "all") return true;
  if (chip.kind === "collection") return p.collection === chip.value;
  return p.category === chip.value;
}

export default function ShopCatalog() {
  const products = useMemo(() => buildUnifiedCatalog(), []);
  const [activeChip, setActiveChip] = useState(0);

  // Pre-select a chip when arriving from a category tile (/shop?filter=<label>).
  useEffect(() => {
    const filter = new URLSearchParams(window.location.search).get("filter");
    if (!filter) return;
    const idx = SHOP_CHIPS.findIndex((c) => c.label === filter);
    if (idx > 0) setActiveChip(idx);
  }, []);

  const visible = useMemo(
    () => products.filter((p) => matches(p, SHOP_CHIPS[activeChip])),
    [products, activeChip],
  );

  return (
    <div>
      {/* Sticky horizontal category filter — sits just below the navbar */}
      <div className="sticky top-20 z-30 -mx-4 mb-12 border-b border-platinum/40 bg-canvas/85 px-4 py-3 backdrop-blur-md sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16">
        <div className="hide-scrollbar -mb-1 flex gap-2.5 overflow-x-auto pb-1">
          {SHOP_CHIPS.map((chip, i) => {
            const on = i === activeChip;
            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => setActiveChip(i)}
                aria-pressed={on}
                className={`inline-flex min-h-[44px] flex-none items-center whitespace-nowrap rounded-full border px-5 text-xs tracking-wide transition-all duration-300 ease-cinematic ${
                  on
                    ? "border-charcoal bg-charcoal text-canvas"
                    : "border-platinum/70 bg-canvas text-graphite hover:border-charcoal/50 hover:text-charcoal"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product grid — strictly 2 on mobile (tight gap → larger images),
          scaling smoothly to 4 on desktop. */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
        {visible.map((p) => (
          <ProductCard
            key={p.id}
            image={p.image}
            secondaryImage={p.secondaryImage}
            href={p.href}
            fit={p.fit}
            title={p.title}
            price={p.price}
            priceLabel={`₪${p.price.toLocaleString("he-IL")}`}
            variants={p.variants}
          />
        ))}
      </div>

      <p className="mt-16 text-center text-xs font-light tracking-wide text-ash">
        {visible.length} {visible.length === 1 ? "פריט" : "פריטים"}
      </p>
    </div>
  );
}
