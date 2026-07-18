import Image from "next/image";

/* Dramatic macro of a moissanite oval pendant on black rock — a dark, high-fire
 * hero that blends into the dark highlight band and matches the materials copy. */
const SPARKLE_MEDIA = "/photo/quality-standard.webp";

/**
 * The ORIDOR Standard — an editorial materials band.
 * Right (RTL start): high-end typography on the rhodium finish + moissanite stone.
 * Left: a macro close-up of a heavily sparkling solitaire, rounded to match UI.
 * Generous vertical padding so it breathes like a luxury spread.
 */
export default function MoissaniteEducation() {
  return (
    // Dark highlight block — a full-width #0A0A0A band that punctuates the
    // bright boutique layout, like a special editorial spread.
    <section className="w-full bg-ink py-20 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-10 md:grid-cols-2 lg:gap-20 lg:px-16">
        {/* Right column (RTL start): text — clean, whitespace-driven, no dividers */}
        <div className="text-right">
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
            הסטנדרט שלנו
          </p>
          <h2 className="text-[1.75rem] font-bold leading-snug tracking-wide text-white sm:text-4xl lg:text-[2.5rem] lg:leading-[1.2]">
            הסטנדרט של ORIDOR: איכות בלי סימני שאלה
          </h2>
          <p className="mt-8 text-[15px] font-normal leading-loose text-white/70 sm:text-base">
            אנחנו מאמינים ביוקרה שנועדה לחיי היומיום. לכן, כל תכשיט שלנו מיוצר
            מכסף 925 טהור עם ציפוי רודיום עמיד – מה שמבטיח שהתכשיט שלך יישאר לבן,
            מבריק ועמיד לאורך שנים (בלי להשחיר ובלי אלרגיות!).
          </p>
          <p className="mt-6 text-[15px] font-normal leading-loose text-white/70 sm:text-base">
            בלב הקולקציה שלנו? אבן מויסניט שנוצצת יותר מיהלום, אבל במחיר שמרגיש
            נכון. יופי, עמידות וברק מטורף – בלי לשלם על המותג.
          </p>
        </div>

        {/* Left column: media — dark macro pendant, native 3:2, gently rounded
            and centred; blends into the dark band. */}
        <div className="relative mx-auto aspect-[3/2] w-full max-w-lg overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
          <Image
            src={SPARKLE_MEDIA}
            alt="תקריב של תליון מואסנייט אובל — הסטנדרט של ORIDOR"
            fill
            sizes="(min-width: 768px) 32rem, 100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
