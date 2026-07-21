"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import MoissaniteGrid, { type MoissaniteProduct } from "./MoissaniteGrid";
import Reveal from "./Reveal";

type TypeKey = "All" | "Rings" | "Bracelets" | "Necklaces" | "Earrings";
type PriceKey = "all" | "under700" | "700to1000" | "over1000";

const TYPE_OPTIONS: { value: TypeKey; label: string }[] = [
  { value: "All", label: "הכל" },
  { value: "Rings", label: "טבעות" },
  { value: "Bracelets", label: "צמידים" },
  { value: "Necklaces", label: "שרשראות" },
  { value: "Earrings", label: "עגילים" },
];

const PRICE_OPTIONS: { value: PriceKey; label: string }[] = [
  { value: "all", label: "הכל" },
  { value: "under700", label: "עד ₪700" },
  { value: "700to1000", label: "₪700 – ₪1,000" },
  { value: "over1000", label: "מעל ₪1,000" },
];

/**
 * Derive a product type from its (Hebrew) name — a safety net used only when a
 * product has no explicit `category`. Keyed on the primary Hebrew noun so a
 * piece is never silently mis-sorted (the old English regexes never matched a
 * Hebrew name and dumped everything into Necklaces).
 */
function typeOf(name: string): Exclude<TypeKey, "All"> {
  if (/טבעת/.test(name)) return "Rings";
  if (/שרשרת/.test(name)) return "Necklaces";
  if (/צמיד|יד/.test(name)) return "Bracelets";
  if (/עגיל|חישוק/.test(name)) return "Earrings";
  return "Necklaces";
}

function inPrice(price: number, key: PriceKey) {
  if (key === "under700") return price < 700;
  if (key === "700to1000") return price >= 700 && price <= 1000;
  if (key === "over1000") return price > 1000;
  return true;
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-wide text-ash">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="appearance-none border-b border-platinum bg-transparent py-1.5 pe-6 text-xs tracking-wide text-charcoal focus:border-silver focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className="pointer-events-none absolute end-0 top-1/2 -translate-y-1/2 text-graphite"
        />
      </div>
    </label>
  );
}

export default function MoissaniteCollection({
  products,
}: {
  products: MoissaniteProduct[];
}) {
  const [type, setType] = useState<TypeKey>("All");
  const [price, setPrice] = useState<PriceKey>("all");

  // ⚠️ DO NOT add slice(0, N) / .take() / any limit here. The grid must render
  // the FULL catalog (all products passed in). Filtering by type/price only.
  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (type === "All" || (p.category ?? typeOf(p.name)) === type) &&
          inPrice(p.price, price),
      ),
    [products, type, price],
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-14 flex flex-col items-center justify-between gap-6 border-y border-platinum/50 py-5 sm:flex-row">
        <Select label="סוג" value={type} options={TYPE_OPTIONS} onChange={setType} />
        <Select label="טווח מחירים" value={price} options={PRICE_OPTIONS} onChange={setPrice} />
      </div>

      {/* One Reveal that mounts once — filtering swaps products inside without
          re-triggering the fade-in. */}
      <Reveal>
        {visible.length > 0 ? (
          <MoissaniteGrid products={visible} layout="grid" />
        ) : (
          <p className="py-16 text-center text-sm font-light text-ash">
            לא נמצאו פריטים שתואמים את הסינון.
          </p>
        )}
      </Reveal>

      <p className="mt-14 text-center text-xs font-light tracking-wide text-ash">
        {visible.length} {visible.length === 1 ? "פריט" : "פריטים"}
      </p>
    </div>
  );
}
