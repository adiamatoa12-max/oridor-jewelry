"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductCard from "./ProductCard";
import { CATEGORIES, CATEGORY_LABELS, type Category, type Product } from "@/lib/products";

type CategoryFilter = "All" | Category;
type Sort = "featured" | "price-asc" | "price-desc";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "מומלצים" },
  { value: "price-asc", label: "מחיר: נמוך לגבוה" },
  { value: "price-desc", label: "מחיר: גבוה לנמוך" },
];

/** Minimal, elegant select with a charcoal label and chevron. */
function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
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

export default function ShopCatalog({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [sort, setSort] = useState<Sort>("featured");

  const categoryOptions = useMemo(
    () => [
      { value: "All" as CategoryFilter, label: "הכל" },
      ...CATEGORIES.map((c) => ({ value: c as CategoryFilter, label: CATEGORY_LABELS[c] })),
    ],
    [],
  );

  const visible = useMemo(() => {
    const filtered =
      category === "All"
        ? products
        : products.filter((p) => p.category === category);

    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered; // featured = original order
  }, [products, category, sort]);

  return (
    <div>
      {/* Filter & sort bar */}
      <div className="mb-14 flex flex-col items-center justify-between gap-6 border-y border-platinum/50 py-5 sm:flex-row">
        <Select
          label="סנן לפי"
          value={category}
          options={categoryOptions}
          onChange={setCategory}
        />
        <Select label="מיין לפי" value={sort} options={SORTS} onChange={setSort} />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
        {visible.map((p) => (
          <ProductCard
            key={p.id}
            image={p.image}
            secondaryImage={p.secondaryImage}
            tag={p.tag}
            title={p.title}
            price={p.price}
            priceLabel={`₪${p.price.toLocaleString("he-IL")}`}
          />
        ))}
      </div>

      <p className="mt-16 text-center text-xs font-light tracking-wide text-ash">
        {visible.length} {visible.length === 1 ? "פריט" : "פריטים"}
      </p>
    </div>
  );
}
