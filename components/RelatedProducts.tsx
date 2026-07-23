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
              {/* One link wraps image, title AND price, so tapping anywhere on
                  the card opens the product — previously the image and title
                  were separate links and the price area wasn't clickable. */}
              <Link
                href={href}
                aria-label={item.name}
                className="block touch-manipulation [-webkit-tap-highlight-color:transparent]"
              >
                {/* 4:5 like every other product frame on the site. This was
                    aspect-square, so the same piece appeared in a different
                    shape here than on the collection grids — and the shared
                    gridImageClass scaling is tuned for a 4:5 frame. */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-transparent">
                  <Image
                    src={encodeURI(item.image_url)}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 30vw, 45vw"
                    className={gridImageClass(item.category)}
                  />
                </div>

                {/* Generous, consistent space between image and title. */}
                <div className="pt-6">
                  <h3 className="min-h-[2.6rem] w-full text-[11px] font-light leading-relaxed tracking-[0.12em] text-charcoal transition-colors duration-300 ease-in-out group-hover:text-gold sm:text-xs">
                    {item.name}
                  </h3>

                  <p className="mt-2.5 text-[11px] font-light tracking-[0.04em] sm:text-xs">
                    {onSale && (
                      <span className="me-2 text-ash line-through">
                        {fmt(item.compare_at_price!)}
                      </span>
                    )}
                    <span className="text-graphite">{fmt(item.price)}</span>
                  </p>
                </div>
              </Link>

              {/* Ghost add-to-cart — a sibling of the link, never nested inside
                  it, so adding to cart can't trigger navigation. */}
              <button
                type="button"
                onClick={() => addByHandle(item.slug)}
                aria-label={`הוספת ${item.name} לסל`}
                className="mt-5 inline-flex self-center items-center justify-center border border-charcoal/30 px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-charcoal transition-colors duration-300 ease-in-out hover:border-charcoal/50 hover:bg-charcoal/[0.05] active:bg-charcoal/[0.08]"
              >
                הוספה לסל
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
