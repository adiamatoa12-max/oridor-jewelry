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
  imagePosition = "object-center",
}: {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Overlay gradient classes — tune per image so the text always pops
   *  (heavier over bright photos, lighter over dark ones). */
  scrim?: string;
  /** object-position for the cover crop — tune per image so the strongest,
   *  text-friendly region sits behind the title (defaults to centre). */
  imagePosition?: string;
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
        className={`object-cover ${imagePosition}`}
      />

      {/* Dark scrim so the white text stays perfectly readable */}
      <div aria-hidden="true" className={`absolute inset-0 ${scrim}`} />

      {/* Centred editorial text */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.5))]">
        {eyebrow && (
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.42em] text-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[32px] font-medium leading-[1.1] tracking-[0.08em] text-white sm:text-[42px] lg:text-[52px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-md text-[13px] font-light leading-relaxed tracking-[0.06em] text-white/80 sm:text-[15px]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
