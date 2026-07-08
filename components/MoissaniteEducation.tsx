/**
 * Moissanite education — a calm, editorial two-column band.
 * Right (RTL start): high-end typography explaining moissanite vs. zircon.
 * Left: a quietly looping video of the stone's brilliance, rounded to match UI.
 * Generous vertical padding so it breathes like a luxury spread.
 */
export default function MoissaniteEducation() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
        {/* Right column (RTL start): text */}
        <div className="text-right">
          <p className="mb-4 text-xs tracking-[0.25em] text-gold">הברק הנצחי</p>
          <h2 className="text-3xl font-light leading-relaxed tracking-wide text-charcoal lg:text-4xl">
            מויסאניט, לא זירקון.
          </h2>
          <span className="my-7 block h-px w-16 bg-platinum" />
          <p className="max-w-md text-base font-light leading-loose text-graphite">
            זירקון מתעמעם ומאבד את ברקו עם הזמן. מויסאניט לעומת זאת, עם מקדם
            שבירת אור גבוה משל יהלום, מבטיח שהאש והניצוץ שלו יישארו נצחיים
            לעולם.
          </p>
        </div>

        {/* Left column: media */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-mist shadow-card md:aspect-square">
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          >
            <source src="/video/clara_post_3.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
