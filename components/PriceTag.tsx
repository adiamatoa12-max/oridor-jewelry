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
  const savePct = onSale ? Math.round(((compareAt! - price) / compareAt!) * 100) : 0;
  const lg = size === "lg";
  // Product page: 20px/bold on mobile (premium-mobile standard), scaling up to
  // the editorial display size on desktop. Cards: quiet + light so the product
  // NAME and image lead the hierarchy, not the price.
  const base = lg
    ? "text-xl font-medium sm:text-3xl sm:font-semibold"
    : "text-[11px] font-light sm:text-xs";
  const strike = lg ? "text-base" : "text-[10px] sm:text-[11px]";
  // On sale, the live price picks up a soft gold tint so the deal still reads,
  // but stays light; otherwise a muted graphite keeps it understated on cards.
  const priceColor = onSale ? "text-gold/90" : lg ? "text-charcoal" : "text-graphite";

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
      <span className={`${base} tracking-[0.04em] ${priceColor}`}>{fmt(price)}</span>
      {onSale && (
        <span className={`${strike} font-light text-ash line-through`}>
          {fmt(compareAt!)}
        </span>
      )}
      {onSale && (
        <span
          className={`self-center rounded-full bg-gold/15 font-semibold tracking-wide text-gold ${
            lg ? "px-2.5 py-1 text-[11px]" : "px-1.5 py-0.5 text-[9.5px]"
          }`}
        >
          {lg ? `חיסכון ${savePct}%` : `‎-${savePct}%`}
        </span>
      )}
    </span>
  );
}
