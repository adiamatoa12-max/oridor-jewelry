import Image from "next/image";
import Link from "next/link";

/**
 * Promo hero — the self-contained campaign graphic ("2+1 על כל האתר") above a
 * clean CTA bar.
 *
 * The image carries the full message baked in (ORIDOR logo, the 2+1 offer, the
 * material tagline). The two collection CTAs live in a dark bar DIRECTLY BELOW
 * the image — never overlaid — so they can't cover the baked tagline, and the
 * white ghost buttons (transparent, thin white border) read cleanly on the dark
 * band. Mobile shows the whole square; desktop is a full-width cover banner.
 */
export default function Hero() {
  const ghost =
    "inline-flex min-h-[50px] flex-1 items-center justify-center whitespace-nowrap rounded-sm border border-white/70 bg-transparent px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:bg-white hover:text-charcoal sm:flex-none sm:px-10 sm:text-[13px] sm:tracking-[0.24em]";

  return (
    <section className="w-full overflow-hidden">
      {/* Campaign artwork — whole graphic on mobile (square), full-width cover
          banner on desktop. Links into the shop. */}
      <Link
        href="/shop"
        aria-label="מבצע 2+1 על כל האתר — למעבר לקולקציה"
        className="relative block aspect-square w-full bg-[#A59178] md:aspect-auto md:h-[62vh] md:min-h-[480px]"
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

      {/* CTA bar — sits cleanly below the image; two ghost buttons, one per
          collection, with breathing room so nothing crowds the artwork. */}
      <div className="flex items-center justify-center gap-3 bg-charcoal px-6 py-5 sm:gap-4">
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
