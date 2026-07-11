import { Star, BadgeCheck } from "lucide-react";

interface Review {
  title: string;
  body: string;
  name: string;
  date: string;
  product: string;
}

const REVIEWS: Review[] = [
  {
    name: "שירן ת.",
    date: "לפני יומיים",
    title: "מושלם מושלם מושלם!",
    body: "השרשרת אפילו יותר יפה במציאות. הגיעה באריזה מהממת תוך יומיים עד הבית. ממליצה בחום!",
    product: "שרשרת קריסטל אובלית",
  },
  {
    name: "דנה ר.",
    date: "לפני שבוע",
    title: "איכות מטורפת",
    body: "חיפשתי צמיד טניס שלא נראה זול וזה פשוט קליעה בול. עונדת אותו כל יום במקלחת והוא נשאר נוצץ לגמרי.",
    product: "צמיד טניס טיפות",
  },
  {
    name: "נועה א.",
    date: "לפני חודש",
    title: "המתנה הכי טובה שקיבלתי",
    body: "בעלי קנה לי ליום הנישואין. שירות הלקוחות היה מהמם ועזר לו לבחור. פשוט תכשיטים ברמה גבוהה.",
    product: "עגילי הלו צמודים",
  },
];

/** Build elegant initials from a Hebrew name, e.g. "שירן ת." → "ש.ת". */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.replace(/\.$/, "").charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join(".");
}

/** Row of 5 stars in a sleek silver/charcoal tone — never gold or yellow. */
function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`} aria-label="5 מתוך 5 כוכבים">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} className="fill-current text-gold" strokeWidth={0} />
      ))}
    </div>
  );
}

/**
 * Social-proof reviews — refined, authentic, image-free cards.
 * Verified badge + stars, an elegant title and muted body, and a minimal
 * initials avatar beside the reviewer. Stars stay silver; no black, no gold.
 */
export default function CustomerReviews() {
  return (
    <section className="mx-auto max-w-7xl rounded-[2rem] bg-beige/50 px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      {/* Header */}
      <div className="mb-16 flex flex-col items-center text-center">
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          אהובות על לקוחותינו
        </h2>
        <Stars className="mt-5" />
        <p className="mt-3 text-sm font-light text-graphite">
          4.9 מתוך 5 על בסיס 150+ ביקורות
        </p>
      </div>

      {/* Review cards — a swipeable snap-carousel on mobile (saves vertical
          space); a neat 3-column grid from md: upward. */}
      <div className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:-mx-10 sm:px-10 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
        {REVIEWS.map((review) => (
          <article
            key={review.name}
            className="flex w-[85vw] flex-shrink-0 snap-center flex-col border border-platinum/40 bg-canvas p-8 sm:w-[70vw] sm:p-10 md:w-auto"
          >
            {/* Top row: verified badge + relative date */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-graphite">
                <BadgeCheck size={15} strokeWidth={1.75} className="text-emerald-500" />
                ביקורת מאומתת
              </span>
              <span className="text-xs font-light text-ash">{review.date}</span>
            </div>

            <Stars className="mt-5" />

            <h3 className="mt-4 text-base font-medium text-charcoal">
              {review.title}
            </h3>
            <p className="mt-2 text-sm font-light leading-relaxed text-graphite">
              {review.body}
            </p>

            {/* Reviewer identity — minimal initials avatar */}
            <div className="mt-8 flex items-center gap-3 border-t border-platinum/40 pt-6">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-canvas text-xs font-medium text-graphite"
              >
                {initials(review.name)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-charcoal">{review.name}</p>
                <p className="mt-0.5 truncate text-xs font-light text-ash">
                  רכשה את: {review.product}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
