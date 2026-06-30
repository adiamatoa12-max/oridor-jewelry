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
        {/* Box image — sleek, minimalist premium jewelry box */}
        <div className="relative min-h-[300px] md:min-h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=1200"
            alt="קופסת התכשיטים המינימליסטית והיוקרתית של Oridor"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-center"
          />
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
