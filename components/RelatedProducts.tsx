"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "./CartContext";
import type { RelatedProduct } from "./ProductDetail";

const fmt = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * "Complete the look" — a clean, high-end related-products grid.
 * 2 cards per row on mobile, 3 on desktop; equal-height cards with a 1:1 image.
 * Subtle hairline that deepens into a soft shadow + lift on hover, the image
 * gently scales, and each card carries an always-visible Quick Add button.
 */
export default function RelatedProducts({
  items,
  hrefBase,
}: {
  items: RelatedProduct[];
  hrefBase: string;
}) {
  const { addByHandle } = useCart();
  if (!items.length) return null;

  return (
    <div className="mt-20 lg:mt-28">
      <h2 className="mb-12 text-center text-2xl font-light tracking-widest text-charcoal lg:mb-16">
        משלים את הלוק
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {items.map((item) => {
          const href = `${hrefBase}/${item.slug}`;
          const onSale =
            typeof item.compare_at_price === "number" &&
            item.compare_at_price > item.price;

          return (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-platinum/50 bg-canvas transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-platinum hover:shadow-cardHover"
            >
              {/* 1:1 image — gently scales on hover */}
              <Link href={href} aria-label={item.name} className="block overflow-hidden">
                <div className="relative aspect-square w-full overflow-hidden bg-canvas">
                  <Image
                    src={encodeURI(item.image_url)}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 30vw, 45vw"
                    className="object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Details — button pinned to the bottom so every card lines up */}
              <div className="flex flex-1 flex-col px-4 pb-4 pt-3 text-center">
                <Link href={href}>
                  <h3 className="text-[13px] font-semibold leading-snug tracking-[0.02em] text-charcoal transition-colors duration-300 group-hover:text-gold">
                    {item.name}
                  </h3>
                </Link>

                <p className="mt-1.5 text-sm font-light">
                  {onSale && (
                    <span className="me-2 text-xs text-ash line-through">
                      {fmt(item.compare_at_price!)}
                    </span>
                  )}
                  <span className="text-graphite">{fmt(item.price)}</span>
                </p>

                <div className="mt-auto pt-4">
                  <button
                    type="button"
                    onClick={() => addByHandle(item.slug)}
                    aria-label={`הוספת ${item.name} לסל`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-charcoal/20 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-charcoal transition-all duration-300 ease-out hover:border-charcoal hover:bg-charcoal hover:text-canvas"
                  >
                    <Plus size={13} strokeWidth={2} />
                    הוספה לסל
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
