"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import type { RelatedProduct } from "./ProductDetail";

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
                    className="object-contain object-center p-4 [filter:drop-shadow(0px_8px_18px_rgba(0,0,0,0.06))] transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Generous, consistent space between image and title. */}
              <div className="pt-6">
                <Link href={href}>
                  <h3 className="text-[11px] font-light leading-relaxed tracking-[0.12em] text-charcoal transition-colors duration-300 ease-in-out group-hover:text-gold sm:text-xs">
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

                {/* Desktop: text-only link, fades in on hover. */}
                <button
                  type="button"
                  onClick={() => addByHandle(item.slug)}
                  aria-label={`הוספת ${item.name} לסל`}
                  className="mt-4 hidden text-[10px] uppercase tracking-[0.22em] text-charcoal underline-offset-4 opacity-0 transition-opacity duration-300 ease-in-out hover:text-gold hover:underline group-hover:opacity-100 sm:inline-block"
                >
                  הוספה לסל
                </button>

                {/* Mobile: clean ghost button — thin outline, no heavy fill. */}
                <button
                  type="button"
                  onClick={() => addByHandle(item.slug)}
                  aria-label={`הוספת ${item.name} לסל`}
                  className="mt-4 inline-flex w-full items-center justify-center border border-charcoal/25 py-2.5 text-[10px] uppercase tracking-[0.2em] text-charcoal transition-colors duration-300 ease-in-out active:bg-charcoal active:text-canvas sm:hidden"
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
