"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";

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

const AUTOPLAY_MS = 5500;

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
 * Customer reviews — a clean, luxury horizontal carousel.
 * Native CSS scroll-snap (swipeable on touch) drives the motion; a small client
 * layer adds dots, desktop arrows and a slow autoplay. Shows 1 card on mobile,
 * 2 on tablet, 3 on desktop. Cards are equal-height so the slider never jumps.
 * RTL-aware scroll math keeps the first review on the reading-start (right).
 */
export default function CustomerReviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const [paused, setPaused] = useState(false);

  const pages = Math.max(1, REVIEWS.length - perView + 1);

  // Recompute how many cards are visible per breakpoint.
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Scroll ONLY the horizontal track — never scrollIntoView, which drags every
  // scrollable ancestor (including the page) back to this section. Using a
  // bounding-rect delta keeps it RTL-agnostic and page-safe.
  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (!track || !card) return;
    const delta =
      card.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  // Track the active card by visibility — robust across RTL scroll conventions.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children);
    const ratios = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target, e.intersectionRatio));
        let best = 0;
        let bestRatio = -1;
        cards.forEach((c, i) => {
          const r = ratios.get(c) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        });
        setIndex(Math.min(best, pages - 1));
      },
      { root: track, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [pages]);

  // Slow autoplay — paused on hover/focus and when everything already fits.
  useEffect(() => {
    if (paused || pages <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % pages;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, pages, scrollToIndex]);

  const go = (i: number) => {
    const clamped = Math.min(Math.max(i, 0), pages - 1);
    setIndex(clamped);
    scrollToIndex(clamped);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      {/* Header */}
      <div className="mb-10 flex flex-col items-center text-center lg:mb-14">
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

      {/* Carousel */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Desktop arrows */}
        {pages > 1 && (
          <>
            <button
              type="button"
              aria-label="הביקורת הקודמת"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              className="absolute -right-3 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-platinum/60 bg-canvas/90 text-charcoal shadow-card backdrop-blur transition-all hover:border-charcoal/40 disabled:pointer-events-none disabled:opacity-0 lg:flex"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="הביקורת הבאה"
              onClick={() => go(index + 1)}
              disabled={index >= pages - 1}
              className="absolute -left-3 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-platinum/60 bg-canvas/90 text-charcoal shadow-card backdrop-blur transition-all hover:border-charcoal/40 disabled:pointer-events-none disabled:opacity-0 lg:flex"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
          </>
        )}

        {/* Snap track */}
        <div
          ref={trackRef}
          className="hide-scrollbar -mx-2.5 flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        >
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="flex w-full shrink-0 snap-start px-2.5 sm:w-1/2 lg:w-1/3"
            >
              <article className="flex w-full flex-col">
                {/* Customer photo — soft corners, subtle shadow + hairline */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_18px_44px_-16px_rgba(0,0,0,0.25)] ring-1 ring-charcoal/10">
                  <Image
                    src={review.photo}
                    alt={review.photoAlt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 85vw"
                    className="object-cover object-center"
                  />
                </div>

                {/* Quote */}
                <div className="mt-5 flex flex-1 flex-col text-right">
                  <Stars className="mb-3" />
                  <h3 className="text-lg font-bold leading-snug text-charcoal">
                    {review.title}
                  </h3>
                  <blockquote className="mt-2.5 text-[15px] font-light leading-[1.85] text-graphite">
                    {review.body}
                  </blockquote>

                  {/* Attribution — small and quiet, label pinned to the bottom */}
                  <figcaption className="mt-auto pt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-light text-ash">
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
            </div>
          ))}
        </div>

        {/* Dots */}
        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2.5">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`מעבר לביקורת ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-charcoal" : "w-1.5 bg-platinum hover:bg-ash"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
