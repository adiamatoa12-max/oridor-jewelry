const fmt = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * Price display with optional launch-promo strikethrough.
 * When `compareAt` is a higher "regular" price, the current price reads as the
 * sale price (gold) with the original struck through beside it.
 */
export default function PriceTag({
  price,
  compareAt,
  className = "",
  size = "sm",
}: {
  price: number;
  compareAt?: number;
  className?: string;
  /** "sm" for cards, "lg" for the product page. */
  size?: "sm" | "lg";
}) {
  const onSale = typeof compareAt === "number" && compareAt > price;
  const base = size === "lg" ? "text-xl" : "text-xs sm:text-[13px]";
  const strike = size === "lg" ? "text-base" : "text-[11px] sm:text-xs";

  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`${base} font-light tracking-[0.06em] ${onSale ? "text-gold" : "text-graphite"}`}>
        {fmt(price)}
      </span>
      {onSale && (
        <span className={`${strike} font-light text-ash line-through`}>
          {fmt(compareAt!)}
        </span>
      )}
    </span>
  );
}
