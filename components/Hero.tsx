import Image from "next/image";
import Link from "next/link";

/**
 * Promo hero — the self-contained campaign graphic ("2+1 על כל האתר") with two
 * ghost CTAs composed into the artwork as one elegant, centred group.
 *
 * The image carries the message baked in (ORIDOR logo, 2+1 offer, material
 * tagline). The two collection CTAs are sleek GHOST buttons — transparent, thin
 * white border, white text — overlaid low on the image, directly beneath the
 * visible tagline, over a soft bottom scrim that keeps both the baked text and
 * the outlines crisp. No solid box, no separate bar. Mobile shows the whole
 * square; desktop is a full-width cover banner.
 */
export default function Hero() {
  const ghost =
    "inline-flex min-h-[42px] flex-1 items-center justify-center whitespace-nowrap rounded-sm border border-white/70 bg-transparent px-4 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-charcoal sm:min-h-[50px] sm:flex-none sm:px-10 sm:text-[13px] sm:tracking-[0.24em]";

  return (
    <section className="relative aspect-square w-full overflow-hidden bg-[#A59178] md:aspect-auto md:h-[72vh] md:min-h-[520px]">
      {/* Campaign artwork — whole graphic on mobile, full-width cover on desktop. */}
      <Link
        href="/shop"
        aria-label="מבצע 2+1 על כל האתר — למעבר לקולקציה"
        className="absolute inset-0 block"
      >
        <Image
          src="/photo/promo-banner-2plus1.png"
          alt="Oridor — מבצע 2+1 על כל האתר: יהלומי מואסנייט ותכשיטי כסף 925 בציפוי רודיום"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </Link>

      {/* Soft bottom scrim — deepens toward the base so the baked tagline and
          the ghost outlines both stay crisp, without darkening the whole image. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-2/5 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
      />

      {/* Ghost CTAs — one centred row directly below the tagline, forming a
          single cohesive group with the artwork's text above it. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2.5 px-5 pb-4 sm:gap-4 sm:pb-10">
        <Link href="/collections/moissanite" className={ghost}>
          קולקציית מואסנייט
        </Link>
        <Link href="/collections/silver" className={ghost}>
          קולקציית כסף 925
        </Link>
      </div>
    </section>
  );
}
