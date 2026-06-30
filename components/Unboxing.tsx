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
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 py-10 sm:px-10 md:grid-cols-2 lg:gap-12 lg:py-12">
        {/* Box image — Oridor's signature LED jewelry box. mix-blend-multiply
            drops the photo's white ground into the beige; a soft elliptical
            ground shadow rests the boxes on a surface instead of floating. */}
        <div className="relative flex items-end justify-center">
          <Image
            src={encodeURI("/photo/קופסא תכשיטים.jpg")}
            alt="קופסת התכשיטים המוארת של Oridor — אחת פתוחה ואחת סגורה"
            width={300}
            height={225}
            sizes="440px"
            className="relative z-10 h-auto w-full max-w-[440px] object-contain mix-blend-multiply drop-shadow-[0_22px_20px_rgba(51,51,51,0.22)]"
          />
          {/* Soft ground shadow */}
          <span className="pointer-events-none absolute bottom-3 left-1/2 h-5 w-3/5 -translate-x-1/2 rounded-[50%] bg-charcoal/25 blur-xl" />
        </div>

        {/* Copy */}
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-xs tracking-[0.25em] text-gold">
            קופסת אורידור
          </p>
          <h2 className="max-w-md text-4xl font-light leading-relaxed tracking-wide text-charcoal lg:text-5xl">
            חוויית האריזה שלנו
          </h2>

          {/* Gold accent divider */}
          <span className="mt-6 block h-px w-16 bg-gold" />

          <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-graphite">
            כל יצירה מגיעה בקופסה ייחודית ויוקרתית, מעוצבת בקפידה כדי לשמר את
            התכשיט שלך לנצח. מרגע הפתיחה ועד לכל פעם מחדש — חוויה שכולה אלגנטיה,
            דיוק ותשומת לב לכל פרט.
          </p>
        </div>
      </div>
    </section>
  );
}
