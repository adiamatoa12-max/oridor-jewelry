import Image from "next/image";

const STORIES = [
  {
    image: "/photo/קולקצית.jpeg",
    title: "עיצוב נקי ועל-זמני",
    body: "כל יצירה נולדת מתוך אהבה לאסתטיקה מינימליסטית — קווים נקיים שנשארים יפים לנצח.",
  },
  {
    image: "/photo/קולקצית 5.jpeg",
    title: "חומרים שנבחרו בקפידה",
    body: "כסף 925 טהור ואבני מואסניט נוצצות בדרגת D / VVS1 — ברק שמתחרה ביהלומים.",
  },
  {
    image: "/photo/קולקצית 6.jpeg",
    title: "מלאכת יד מדויקת",
    body: "גימור קפדני וציפוי רודיום עמיד, שהופכים כל פריט ליצירת אמנות לכל החיים.",
  },
].map((s) => ({ ...s, image: encodeURI(s.image) }));

/**
 * "Craftsmanship / Our Story" — three captivating lifestyle images that tell the
 * Oridor story, with elegant captions. Replaces the bestsellers grid.
 */
export default function CraftStory() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
      <div className="mb-14 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">מאחורי כל יצירה</p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          מלאכת היד שלנו
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-12">
        {STORIES.map((s) => (
          <article key={s.title} className="group text-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-beige shadow-card">
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover object-center transition-transform duration-[1200ms] ease-cinematic group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            </div>
            <h3 className="mt-6 text-lg font-light tracking-wide text-charcoal">
              {s.title}
            </h3>
            <p className="mx-auto mt-3 max-w-xs text-sm font-light leading-relaxed text-graphite">
              {s.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
