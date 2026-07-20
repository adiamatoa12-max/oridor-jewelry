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
  // the editorial display size on desktop. Cards: compact.
  const base = lg
    ? "text-xl font-medium sm:text-3xl sm:font-semibold"
    : "text-xs font-light sm:text-[13px]";
  const strike = lg ? "text-base" : "text-[11px] sm:text-xs";

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-1 ${className}`}>
      <span className={`${base} tracking-[0.04em] text-charcoal`}>{fmt(price)}</span>
      {onSale && (
        <span className={`${strike} font-light text-ash line-through`}>
          {fmt(compareAt!)}
        </span>
      )}
      {onSale && lg && (
        <span className="self-center rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-gold">
          חיסכון {savePct}%
        </span>
      )}
    </span>
  );
}
