import Image from "next/image";
import { Star, BadgeCheck } from "lucide-react";

interface Review {
  title: string;
  body: string;
  name: string;
  date: string;
  product: string;
  photo: string;
  photoAlt: string;
}

const REVIEWS: Review[] = [
  {
    name: "שירן ת.",
    date: "לפני יומיים",
    title: "מושלם מושלם מושלם!",
    body: "וואו, הצמיד פשוט נוצץ בטירוף על היד! יפה הרבה יותר מבתמונות. האריזה הגיעה מהר והיא ממש מושקעת, רואים שחשבו על הכל. בטוח אזמין שוב.",
    product: "צמיד טניס אבני חן שחורות",
    photo: "/photo/oridor-bracelet-tennis-black-moissanite-wrist.webp",
    photoAlt: "לקוחה עונדת צמיד טניס אבני חן שחורות מבית Oridor",
  },
  {
    name: "דנה ר.",
    date: "לפני שבוע",
    title: "איכות מטורפת!",
    body: "חיפשתי שרשרת שלא נראית זולה וזה פשוט קליעה בול. עונדת אותה כל יום, גם במקלחת, והיא נשארת נוצצת לגמרי!",
    product: "שרשרת תליון סוליטר",
    photo: "/photo/oridor-necklace-solitaire-moissanite-neck.webp",
    photoAlt: "לקוחה עונדת שרשרת תליון סוליטר מבית Oridor",
  },
  {
    name: "נועה א.",
    date: "לפני חודש",
    title: "המתנה הכי טובה שקיבלתי",
    body: "בעלי הפתיע אותי עם הטבעת הזו ליום הנישואין. שירות הלקוחות היה מהמם ועזר לו לבחור בדיוק את מה שמתאים לי. פשוט תכשיטים ברמה גבוהה!",
    product: "טבעת מרקיזה שלושה",
    photo: "/photo/oridor-ring-marquise-cluster-lifestyle.webp",
    photoAlt: "לקוחה עונדת טבעת מרקיזה שלושה מבית Oridor",
  },
];

/** Aggregate rating shown in the header. */
const AGGREGATE = { score: "4.9", count: 160 };

/** Row of 5 crisp green stars — filled, no outline. */
function Stars({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`} aria-label="5 מתוך 5 כוכבים">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          className="fill-emerald-500 text-emerald-500"
        />
      ))}
    </div>
  );
}

/**
 * Customer reviews — a clean, professional card grid.
 * Centered header with the aggregate rating, then rounded review cards
 * (verified badge, green stars, bold title + body, optional photo thumbnail,
 * and an avatar-initial attribution). 1 column on mobile, 2 on tablet, 3 on
 * desktop; equal-height cards keep the row tidy.
 */
export default function CustomerReviews() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
      {/* Header — bold title + aggregate score */}
      <div className="mb-10 flex flex-col items-center text-center lg:mb-14">
        <h2 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
          דירוג הלקוחות <span className="text-emerald-600">״מצוין״</span>
        </h2>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
          <Stars size={18} />
          <span className="text-sm font-medium text-graphite">
            {AGGREGATE.score} • מבוסס על {AGGREGATE.count} ביקורות
          </span>
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {REVIEWS.map((review) => {
          const initial = review.name.trim().charAt(0);
          return (
            <article
              key={review.name}
              className="flex flex-col rounded-2xl border border-platinum/60 bg-canvas p-6 text-right shadow-card transition-shadow duration-300 hover:shadow-cardHover"
            >
              {/* Top row — green stars (reading start) + verified badge (corner) */}
              <div className="flex items-start justify-between gap-2">
                <Stars />
                <span className="inline-flex flex-none items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-600/15">
                  <BadgeCheck size={12} strokeWidth={2} className="text-emerald-600" />
                  ביקורת מאומתת
                </span>
              </div>

              {/* Title + body */}
              <h3 className="mt-4 text-base font-bold leading-snug text-charcoal sm:text-[17px]">
                {review.title}
              </h3>
              <blockquote className="mt-2 text-sm font-light leading-[1.85] text-graphite">
                {review.body}
              </blockquote>

              {/* Optional customer photo thumbnail */}
              {review.photo && (
                <div className="relative mt-4 h-[72px] w-[72px] flex-none overflow-hidden rounded-xl ring-1 ring-platinum/50">
                  <Image
                    src={review.photo}
                    alt={review.photoAlt}
                    fill
                    sizes="72px"
                    className="object-cover object-center"
                  />
                </div>
              )}

              {/* Attribution — avatar initial + name + date, pinned to the bottom */}
              <div className="mt-auto flex items-center gap-3 border-t border-platinum/40 pt-5">
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold ring-1 ring-gold/25"
                >
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-charcoal">
                    {review.name}
                  </p>
                  <p className="text-[11px] font-light text-ash">{review.date}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
