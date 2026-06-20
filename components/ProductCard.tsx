"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";

export interface ProductCardProps {
  /** Product image — expects a clean white-background product shot. */
  image: string;
  /** Optional lifestyle image that cross-fades in on hover. */
  secondaryImage?: string;
  title: string;
  /** Numeric price; formatted as currency unless `priceLabel` is given. */
  price: number;
  /** Optional pre-formatted price string (overrides `price` formatting). */
  priceLabel?: string;
  href?: string;
  currency?: string;
}

/**
 * Reusable product card.
 * Image sits on a crisp white surface; charcoal title + price beneath.
 * Subtle cinematic lift on hover — no harsh shadows, no black.
 *
 * Quick Add: on hover (desktop) a delicate "Add to Cart" button fades in over
 * the bottom of the image; on mobile that same action is always visible beneath
 * the price.
 */
export default function ProductCard({
  image,
  secondaryImage,
  title,
  price,
  priceLabel,
  href = "#",
  currency = "USD",
}: ProductCardProps) {
  const { openCart } = useCart();

  const formattedPrice =
    priceLabel ??
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);

  // Quick-add: don't navigate the parent link; open the cart drawer.
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openCart();
  };

  const quickAddLabel = `הוספה מהירה — ${title}`;

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50 shadow-card ring-1 ring-platinum/40 transition-all duration-700 ease-in-out group-hover:-translate-y-1 group-hover:shadow-cardHover">
        <Image
          src={image}
          alt={`${title} — תכשיט כסף מבית Oridor`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${
            secondaryImage ? "group-hover:opacity-0" : ""
          }`}
        />

        {/* Lifestyle image — cross-fades in on hover */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${title} בסגנון לייפסטייל`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-100"
          />
        )}

        {/* Quick Add — hover-reveal over the bottom of the image (desktop only) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden p-4 opacity-0 transition-opacity duration-500 ease-cinematic group-hover:opacity-100 sm:block">
          <button
            type="button"
            onClick={handleAdd}
            aria-label={quickAddLabel}
            className="btn-primary pointer-events-auto w-full"
          >
            הוספה מהירה
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-sm font-normal tracking-wide text-charcoal">
          {title}
        </h3>
        <p className="mt-1.5 text-sm font-light text-graphite">{formattedPrice}</p>

        {/* Quick Add — always visible beneath price on mobile */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={quickAddLabel}
          className="btn-primary mt-4 w-full sm:hidden"
        >
          הוספה מהירה
        </button>
      </div>
    </Link>
  );
}
