import { Star } from "lucide-react";

/**
 * Star-rating row shown under the product title.
 *
 * Honest placeholder: until real reviews are wired in (pass `rating` + `count`),
 * it renders five OUTLINE stars and an invitation to review — never a fabricated
 * score. Once a product carries real aggregate data, pass it and the row fills
 * the stars and shows "4.9 · 128 חוות דעת" — so the UI is ready to integrate
 * user reviews with no layout change.
 */
export default function ReviewStars({ rating, count }: { rating?: number; count?: number }) {
  const hasReviews = typeof rating === "number" && typeof count === "number" && count > 0;
  const filled = hasReviews ? Math.round(rating!) : 0;

  return (
    <div className="mt-3 flex items-center gap-2">
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={hasReviews ? `דירוג ${rating!.toFixed(1)} מתוך 5` : "אין עדיין חוות דעת"}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            size={15}
            strokeWidth={1.5}
            className={i < filled ? "fill-gold text-gold" : "fill-transparent text-platinum"}
          />
        ))}
      </div>
      <span className="text-[12px] font-light text-ash">
        {hasReviews ? `${rating!.toFixed(1)} · ${count} חוות דעת` : "היו הראשונים לדרג"}
      </span>
    </div>
  );
}
