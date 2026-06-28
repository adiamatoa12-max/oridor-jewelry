import Image from "next/image";

/**
 * The Unboxing Experience.
 * A deep, luxurious dark section showcasing the signature packaging. Split
 * layout: premium box image beside Hebrew copy with a subtle gold accent.
 */
export default function Unboxing() {
  return (
    <section className="w-full bg-[#0A0A0A] text-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Box image */}
        <div className="relative min-h-[360px] md:min-h-[560px]">
          <Image
            src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=1200"
            alt="קופסת התכשיטים היוקרתית של Oridor"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Copy */}
        <div className="flex flex-col justify-center p-12 sm:p-16 lg:p-20">
          <p className="mb-4 font-serif text-sm italic tracking-wide text-gold">
            The Oridor Box
          </p>
          <h2 className="max-w-md text-3xl font-light leading-relaxed tracking-wide text-white lg:text-4xl">
            חוויית האריזה שלנו
          </h2>

          {/* Gold accent divider */}
          <span className="mt-6 block h-px w-16 bg-gold" />

          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-white/70">
            כל יצירה מגיעה בקופסה ייחודית ויוקרתית, מעוצבת בקפידה כדי לשמר את
            התכשיט שלך לנצח. מרגע הפתיחה ועד לכל פעם מחדש — חוויה שכולה אלגנטיה,
            דיוק ותשומת לב לכל פרט.
          </p>
        </div>
      </div>
    </section>
  );
}
