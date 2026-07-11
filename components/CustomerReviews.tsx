import Image from "next/image";
import { Star, BadgeCheck } from "lucide-react";

interface Review {
  title: string;
  body: string;
  name: string;
  date: string;
  product: string;
  /** Optional customer-uploaded photo (UGC). When present it becomes the
   *  focal point of the review. Path under /public. */
  photo?: string;
}

const REVIEWS: Review[] = [
  {
    name: "שירן ת.",
    date: "לפני יומיים",
    title: "מושלם מושלם מושלם!",
    body: "השרשרת אפילו יותר יפה במציאות. הגיעה באריזה מהממת תוך יומיים עד הבית. ממליצה בחום!",
    product: "שרשרת קריסטל אובלית",
    photo: "/photo/hover אורידור 4.jpeg",
  },
  {
    name: "דנה ר.",
    date: "לפני שבוע",
    title: "איכות מטורפת",
    body: "חיפשתי צמיד טניס שלא נראה זול וזה פשוט קליעה בול. עונדת אותו כל יום במקלחת והוא נשאר נוצץ לגמרי.",
    product: "צמיד טניס טיפות",
    photo: "/photo/hover אורידור 8.jpeg",
  },
  {
    name: "נועה א.",
    date: "לפני חודש",
    title: "המתנה הכי טובה שקיבלתי",
    body: "בעלי קנה לי ליום הנישואין. שירות הלקוחות היה מהמם ועזר לו לבחור. פשוט תכשיטים ברמה גבוהה.",
    product: "עגילי הלו צמודים",
  },
];

/** Row of 5 crisp golden stars. Filled, no outline. */
function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-1 ${className}`} aria-label="5 מתוך 5 כוכבים">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className="fill-gold text-gold" strokeWidth={0} />
      ))}
    </div>
  );
}

/**
 * Customer reviews — organic social proof, not a widget.
 *
 * Frameless editorial spread: no cards, borders, shadows, or fills. Each review
 * floats on the page with generous whitespace. Reviews with a customer photo
 * (UGC) lead with the image as the focal point; text-only reviews read as a
 * clean pull-quote. Seamless swipe on mobile, an editorial 3-column grid on
 * desktop. Stars stay crisp and golden.
 */
export default function CustomerReviews() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      {/* Header */}
      <div className="mb-14 flex flex-col items-center text-center lg:mb-20">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">
          מה אומרות עלינו
        </p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          אהובות על לקוחותינו
        </h2>
        <div className="mt-5 flex items-center gap-2.5">
          <Stars />
          <span className="text-xs font-light text-ash">
            4.9 · 150+ ביקורות מאומתות
          </span>
        </div>
      </div>

      {/* Reviews — seamless swipe carousel on mobile; a frameless editorial
          grid from md upward. No boxes: content floats on the page. */}
      <div className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-2 sm:-mx-10 sm:px-10 md:mx-0 md:grid md:grid-cols-3 md:gap-x-10 md:gap-y-16 md:overflow-visible md:px-0 lg:gap-x-14">
        {REVIEWS.map((review) => (
          <figure
            key={review.name}
            className="flex w-[82vw] flex-shrink-0 snap-center flex-col sm:w-[60vw] md:w-auto"
          >
            {/* UGC photo — the focal point when a customer shared one */}
            {review.photo && (
              <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden rounded-xl">
                <Image
                  src={encodeURI(review.photo)}
                  alt={`תמונה מ${review.name} — ${review.product}`}
                  fill
                  sizes="(min-width: 768px) 30vw, 82vw"
                  className="object-cover object-center"
                />
              </div>
            )}

            <Stars className="mb-4" />

            <h3 className="text-[15px] font-medium leading-snug text-charcoal">
              {review.title}
            </h3>
            <blockquote className="mt-2.5 text-[15px] font-light leading-[1.85] text-graphite">
              {review.body}
            </blockquote>

            {/* Attribution — deliberately small and quiet */}
            <figcaption className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-light text-ash">
              <span className="font-medium tracking-wide text-graphite">
                {review.name}
              </span>
              <span className="inline-flex items-center gap-1">
                <BadgeCheck size={12} strokeWidth={1.5} className="text-emerald-500" />
                מאומתת
              </span>
              <span aria-hidden="true">·</span>
              <span>{review.date}</span>
            </figcaption>
            <p className="mt-1 text-[11px] font-light text-ash">
              רכשה: {review.product}
            </p>
          </figure>
        ))}
      </div>
    </section>
  );
}
