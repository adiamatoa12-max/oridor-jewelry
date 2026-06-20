import Link from "next/link";

/**
 * Editorial split feature.
 * A silent, looping campaign video beside a calm text block. Stacks on mobile.
 * Charcoal/graphite type on crisp white — airy, editorial, RTL-native.
 */
export default function EditorialFeature() {
  return (
    <section className="grid w-full grid-cols-1 md:grid-cols-2">
      {/* Video half */}
      <div className="relative min-h-[420px] md:min-h-[600px]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        >
          <source src="/video/clara_post_3.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Text half */}
      <div className="flex flex-col justify-center bg-canvas p-12 sm:p-16 lg:p-20">
        <p className="mb-4 text-xs uppercase tracking-brand text-ash">הסיפור שלנו</p>
        <h2 className="max-w-md text-3xl font-light leading-relaxed tracking-wide text-charcoal lg:text-4xl">
          נוצר באהבה, נועד להישאר
        </h2>
        <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-graphite">
          כל פריט נוצר בקפידה מכסף 925 טהור, בעבודת יד מדויקת ובתשומת לב לכל פרט.
          עיצובים נקיים ועל-זמניים שנועדו ללוות אתכן בכל רגע — מהיום-יום ועד
          הרגעים הבלתי נשכחים.
        </p>
        <Link
          href="/shop"
          className="mt-10 inline-flex min-h-[44px] w-fit items-center justify-center border border-charcoal/70 px-10 py-3 text-xs tracking-wide text-charcoal transition-all duration-300 ease-cinematic hover:bg-charcoal hover:text-canvas"
        >
          גלי את הסיפור
        </Link>
      </div>
    </section>
  );
}
