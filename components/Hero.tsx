import Image from "next/image";
import Link from "next/link";

/**
 * Promo hero — a single self-contained campaign graphic ("2+1 על כל האתר").
 *
 * The image already carries the full message baked in (the ORIDOR logo, the
 * 2+1 offer and the material tagline), so there is NO separate overlaid copy —
 * that would only duplicate the artwork.
 *
 * The asset is square (1:1). To guarantee the WHOLE graphic (and its text) is
 * always visible and never awkwardly cropped, the image is shown complete: a
 * centred square that fills the width on mobile and is capped to a comfortable
 * size on desktop, sitting on a warm taupe field (#A59178) that matches the
 * image's own background so the full-width section reads as one seamless block.
 * A prominent CTA sits directly beneath the artwork.
 */
export default function Hero() {
  return (
    <section className="w-full bg-[#A59178]">
      <div className="mx-auto flex w-full flex-col items-center pb-10 sm:pb-14">
        {/* Full promo artwork — always shown complete, centred. Square container
            === square asset, so object-cover fills it with zero crop. */}
        <Link
          href="/shop"
          aria-label="מבצע 2+1 על כל האתר — למעבר לקולקציה"
          className="relative block aspect-square w-full max-w-[560px] sm:max-w-[680px] lg:max-w-[820px]"
        >
          <Image
            src="/photo/promo-banner-2plus1.png"
            alt="Oridor — מבצע 2+1 על כל האתר: יהלומי מואסנייט ותכשיטי כסף 925 בציפוי רודיום"
            fill
            priority
            sizes="(min-width: 1024px) 820px, (min-width: 640px) 680px, 100vw"
            className="object-cover object-center"
          />
        </Link>

        {/* Call to action — clean, prominent, on the light taupe field. */}
        <Link
          href="/shop"
          className="mt-8 inline-flex min-h-[54px] items-center justify-center rounded-sm bg-charcoal px-12 text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_28px_-12px_rgba(20,20,20,0.6)] transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:bg-[#111] sm:mt-9 sm:text-[13px]"
        >
          למעבר לקולקציה
        </Link>
      </div>
    </section>
  );
}
