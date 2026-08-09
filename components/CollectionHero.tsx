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
  showAccents = true,
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
  /** Decorative hairlines (flanking the eyebrow + under the title). Set false
   *  for a cleaner, line-free banner. */
  showAccents?: boolean;
}) {
  return (
    <section className="relative h-[340px] w-full overflow-hidden bg-mist md:h-[460px]">
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
      {/* Soft vignette — deepens the edges so the centred title reads with more
          depth and the composition feels intentional, like a campaign shot. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4))]"
      />

      {/* Centred editorial text */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center [filter:drop-shadow(0_2px_12px_rgba(0,0,0,0.55))]">
        {eyebrow &&
          (showAccents ? (
            // Gold eyebrow framed by two hairlines — a classic couture masthead
            // motif that signals the collection with quiet authority.
            <div className="mb-6 flex items-center gap-3.5">
              <span aria-hidden="true" className="h-px w-8 bg-gold/50 sm:w-10" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.44em] text-gold sm:text-[11px]">
                {eyebrow}
              </p>
              <span aria-hidden="true" className="h-px w-8 bg-gold/50 sm:w-10" />
            </div>
          ) : (
            // Clean, line-free eyebrow.
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.44em] text-gold sm:text-[11px]">
              {eyebrow}
            </p>
          ))}
        <h1 className="text-[40px] font-bold leading-[1.02] tracking-[0.01em] text-white sm:text-[56px] lg:text-[68px]">
          {title}
        </h1>
        {subtitle && (
          <>
            {/* Slim divider between the commanding title and the fine-print
                subtitle — sets the boutique rhythm. Hidden when accents off. */}
            {showAccents && (
              <span aria-hidden="true" className="mt-7 h-px w-14 bg-white/35" />
            )}
            <p
              className={`${showAccents ? "mt-6" : "mt-5"} max-w-lg text-[14px] font-light leading-relaxed tracking-[0.09em] text-white/85 sm:text-[16px]`}
            >
              {subtitle}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
