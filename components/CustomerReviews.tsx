import Image from "next/image";
import { Star, BadgeCheck } from "lucide-react";

interface Review {
  title: string;
  body: string;
  name: string;
  date: string;
  product: string;
  /** Customer photo (UGC). */
  photo: string;
  /** Accessible description of the photo. */
  photoAlt: string;
}

const REVIEWS: Review[] = [
  {
    name: "שירן ת.",
    date: "לפני יומיים",
    title: "מושלם מושלם מושלם!",
    body: "וואו, הצמיד פשוט נוצץ בטירוף על היד! יפה הרבה יותר מבתמונות. האריזה הגיעה מהר והיא ממש מושקעת, רואים שחשבו על הכל. בטוח אזמין שוב.",
    product: "צמיד טניס אובלי",
    photo: "/photo/review-1.webp",
    photoAlt: "לקוחה עונדת צמיד טניס אובלי מבית Oridor",
  },
  {
    name: "דנה ר.",
    date: "לפני שבוע",
    title: "איכות מטורפת!",
    body: "חיפשתי שרשרת שלא נראית זולה וזה פשוט קליעה בול. עונדת אותה כל יום, גם במקלחת, והיא נשארת נוצצת לגמרי!",
    product: "שרשרת טניס אובלית",
    photo: "/photo/review-2.webp",
    photoAlt: "לקוחה עונדת שרשרת טניס אובלית מבית Oridor",
  },
  {
    name: "נועה א.",
    date: "לפני חודש",
    title: "המתנה הכי טובה שקיבלתי",
    body: "בעלי הפתיע אותי עם העגילים האלו ליום הנישואין. שירות הלקוחות היה מהמם ועזר לו לבחור בדיוק את מה שמתאים לי. פשוט תכשיטים ברמה גבוהה!",
    product: "עגילי הלו צמודים",
    photo: "/photo/review-3.webp",
    photoAlt: "לקוחה עונדת עגילי הלו צמודים מבית Oridor",
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
 * Customer reviews — an editorial spread of real customer photos.
 * Each review is a balanced 50/50 split: a soft-rounded customer photo on one
 * side, the quote on the other, alternating sides down the page for rhythm.
 * Images carry a subtle shadow + hairline so they lift off the background.
 * Stacks cleanly on mobile (photo above text). Stars stay crisp and golden.
 */
export default function CustomerReviews() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
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

      {/* Reviews — alternating image/text spread */}
      <div className="space-y-16 lg:space-y-24">
        {REVIEWS.map((review, i) => (
          <article
            key={review.name}
            className={`flex flex-col gap-7 md:items-center md:gap-12 lg:gap-16 ${
              i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            {/* Customer photo — soft corners, subtle shadow + hairline */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_18px_44px_-16px_rgba(0,0,0,0.25)] ring-1 ring-charcoal/10 md:basis-1/2">
              <Image
                src={review.photo}
                alt={review.photoAlt}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover object-center"
              />
            </div>

            {/* Quote */}
            <div className="text-right md:basis-1/2">
              <Stars className="mb-4" />
              <h3 className="text-lg font-bold leading-snug text-charcoal">
                {review.title}
              </h3>
              <blockquote className="mt-3 text-[15px] font-light leading-[1.85] text-graphite">
                {review.body}
              </blockquote>

              {/* Attribution — small and quiet */}
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
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
