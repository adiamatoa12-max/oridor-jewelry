import Image from "next/image";

/* High-sparkle macro — a round-brilliant halo solitaire on a clean white ground,
 * cropped tight on the stone so the fire fills the frame and matches the copy.
 * Uses moissanite-11 (a piece NOT shown in the homepage preview grid) so the
 * homepage never renders the same photo twice. */
const SPARKLE_MEDIA = "/photo/moissanite-11.jpeg";

/**
 * The ORIDOR Standard — an editorial materials band.
 * Right (RTL start): high-end typography on the rhodium finish + moissanite stone.
 * Left: a macro close-up of a heavily sparkling solitaire, rounded to match UI.
 * Generous vertical padding so it breathes like a luxury spread.
 */
export default function MoissaniteEducation() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
        {/* Right column (RTL start): text */}
        <div className="text-right">
          <p className="mb-4 text-xs tracking-[0.25em] text-gold">הסטנדרט שלנו</p>
          <h2 className="text-2xl font-light leading-relaxed tracking-wide text-charcoal sm:text-3xl lg:text-[2.1rem]">
            הסטנדרט של ORIDOR: חומרים ללא פשרות
          </h2>
          <span className="my-8 block h-px w-16 bg-platinum" />
          <p className="text-base font-light leading-loose text-graphite">
            כל תכשיט בקולקציה שלנו מיוצר מכסף סטרלינג 925 איכותי ומצופה ברודיום –
            מתכת נדירה ויוקרתית ממשפחת הפלטינה. ציפוי הרודיום מעניק לתכשיט את הגוון
            הבוהק של זהב לבן, מגן עליו מפני השחרה לחלוטין ומבטיח שהוא יהיה
            היפואלרגני ובטוח לעור.
          </p>
          <p className="mt-6 text-base font-light leading-loose text-graphite">
            במרכז העיצובים שלנו עומדת אבן המויסאניט. עם מדד שבירת אור גבוה אפילו
            מזה של יהלום, מויסאניט מעניקה נצנוץ אש עוצר נשימה וקשיחות יוצאת דופן
            שעמידה לשריטות. זוהי בחירה חכמה ויוקרתית שמבטיחה תכשיט שישמור על הברק
            המטורף שלו לנצח – בלי המחיר המופרז של יהלום כרייה.
          </p>
        </div>

        {/* Left column: media — macro sparkle, cropped tight on the stone */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-mist shadow-card">
          <Image
            src={SPARKLE_MEDIA}
            alt="תקריב של סוליטר מויסאניט עגול לוכד את האור"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="scale-150 object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
