import Image from "next/image";

/**
 * The Unboxing Experience.
 * A light, minimalist section showcasing the signature packaging. Split layout:
 * a sleek premium box image beside Hebrew copy with a subtle gold accent, on a
 * soft beige background for a seamless scroll.
 */
export default function Unboxing() {
  return (
    <section className="w-full bg-beige text-charcoal">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Box image — Oridor's signature LED jewelry box. The photo is on a
            white ground, so it sits in a clean white card (object-contain at its
            native size) that blends seamlessly and never looks blown out. */}
        <div className="flex min-h-[300px] items-center justify-center p-8 sm:p-12 md:min-h-[420px]">
          <div className="flex w-full max-w-sm items-center justify-center rounded-md bg-canvas p-8 shadow-card sm:p-10">
            <Image
              src={encodeURI("/photo/קופסא תכשיטים.jpg")}
              alt="קופסת התכשיטים המוארת של Oridor — אחת פתוחה ואחת סגורה"
              width={300}
              height={225}
              sizes="280px"
              className="h-auto w-full max-w-[260px] object-contain"
            />
          </div>
        </div>

        {/* Copy */}
        <div className="flex flex-col justify-center p-10 sm:p-12 lg:p-16">
          <p className="mb-4 text-xs tracking-[0.25em] text-gold">
            קופסת אורידור
          </p>
          <h2 className="max-w-md text-3xl font-light leading-relaxed tracking-wide text-charcoal lg:text-4xl">
            חוויית האריזה שלנו
          </h2>

          {/* Gold accent divider */}
          <span className="mt-6 block h-px w-16 bg-gold" />

          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-graphite">
            כל יצירה מגיעה בקופסה ייחודית ויוקרתית, מעוצבת בקפידה כדי לשמר את
            התכשיט שלך לנצח. מרגע הפתיחה ועד לכל פעם מחדש — חוויה שכולה אלגנטיה,
            דיוק ותשומת לב לכל פרט.
          </p>
        </div>
      </div>
    </section>
  );
}
