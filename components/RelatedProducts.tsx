"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import type { RelatedProduct } from "./ProductDetail";
import { gridImageClass } from "@/lib/gridImage";

const fmt = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * "Complete the look" — luxury-editorial related products.
 *
 * No cards, borders, shadows or backgrounds: each product floats on the page
 * with generous whitespace, centred light typography, and a soft product
 * contact-shadow that keeps it from looking pasted. Quick-add is a text-only
 * link that fades in on hover (desktop) and a clean ghost button on mobile.
 * All hover transitions are a soft 0.3s ease-in-out.
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
    <div className="mt-24 lg:mt-32">
      <h2 className="mb-14 text-center text-2xl font-light tracking-widest text-charcoal lg:mb-20">
        משלים את הלוק
      </h2>

      {/* 2-up on mobile, 3-up on desktop, with generous catalog gaps. */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-10 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-20">
        {items.map((item) => {
          const href = `${hrefBase}/${item.slug}`;
          const onSale =
            typeof item.compare_at_price === "number" &&
            item.compare_at_price > item.price;

          return (
            <div
              key={item.id}
              className="group flex flex-col text-center transition-transform duration-300 ease-in-out md:hover:-translate-y-1"
            >
              {/* Image floats directly on the page — no box, border or fill;
                  only a soft contact shadow. Gently scales on hover. */}
              <Link href={href} aria-label={item.name} className="block">
                <div className="relative aspect-square w-full overflow-hidden bg-transparent">
                  <Image
                    src={encodeURI(item.image_url)}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 30vw, 45vw"
                    className={gridImageClass(item.category)}
                  />
                </div>
              </Link>

              {/* Generous, consistent space between image and title. */}
              <div className="pt-6">
                <Link href={href}>
                  <h3 className="min-h-[2.6rem] w-full text-[11px] font-light leading-relaxed tracking-[0.12em] text-charcoal transition-colors duration-300 ease-in-out group-hover:text-gold sm:text-xs">
                    {item.name}
                  </h3>
                </Link>

                <p className="mt-2.5 text-[11px] font-light tracking-[0.04em] sm:text-xs">
                  {onSale && (
                    <span className="me-2 text-ash line-through">
                      {fmt(item.compare_at_price!)}
                    </span>
                  )}
                  <span className="text-graphite">{fmt(item.price)}</span>
                </p>

                {/* Ghost add-to-cart — always visible for unmistakable clarity:
                    a thin 1px outline with elegant padding (8px / 20px) that
                    softly fills with a light charcoal tint on hover. */}
                <button
                  type="button"
                  onClick={() => addByHandle(item.slug)}
                  aria-label={`הוספת ${item.name} לסל`}
                  className="mt-5 inline-flex items-center justify-center border border-charcoal/30 px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-charcoal transition-colors duration-300 ease-in-out hover:border-charcoal/50 hover:bg-charcoal/[0.05] active:bg-charcoal/[0.08]"
                >
                  הוספה לסל
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
