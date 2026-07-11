import Image from "next/image";

/**
 * Full-width collection hero — a cover background image under a dark scrim with
 * centred, editorial white text. Compact responsive height (300px mobile /
 * 400px desktop) so the product grid still starts near the fold. The image is
 * `priority` (it's the page's LCP) and sized for the full viewport width.
 */
export default function CollectionHero({
  image,
  eyebrow,
  title,
  subtitle,
  scrim = "bg-gradient-to-b from-black/45 via-black/45 to-black/60",
}: {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Overlay gradient classes — tune per image so the text always pops
   *  (heavier over bright photos, lighter over dark ones). */
  scrim?: string;
}) {
  return (
    <section className="relative h-[300px] w-full overflow-hidden bg-mist md:h-[400px]">
      {/* Cover background image */}
      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark scrim so the white text stays perfectly readable */}
      <div aria-hidden="true" className={`absolute inset-0 ${scrim}`} />

      {/* Centred editorial text */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.5))]">
        {eyebrow && (
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-light uppercase leading-tight tracking-[0.18em] text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed tracking-wide text-white/85 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
