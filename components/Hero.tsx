import Image from "next/image";
import Link from "next/link";

/**
 * Promo hero — a single self-contained campaign graphic ("2+1 על כל האתר"),
 * presented as a full-bleed e-commerce hero.
 *
 * The image carries the full message baked in (ORIDOR logo, the 2+1 offer, the
 * material tagline), so there is NO separate overlaid copy. It is a proper
 * cover banner: a defined min-height (taller than a thin strip so the visual
 * scales generously) with `object-cover object-center`, so the image fills the
 * section edge-to-edge and the central 2+1 message always stays framed. The
 * warm taupe bg (#A59178) matches the artwork's own background as a load
 * fallback. A prominent CTA sits over the lower edge, above a soft scrim.
 */
export default function Hero() {
  return (
    <section className="relative w-full min-h-[500px] overflow-hidden bg-[#A59178] sm:min-h-[560px] lg:min-h-[620px]">
      {/* Full-bleed campaign artwork — cover + centred so it scales cleanly and
          the main 2+1 text stays in frame on every screen. Links into the shop. */}
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

      {/* Soft bottom scrim so the CTA reads cleanly over the image. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-black/45 via-black/15 to-transparent"
      />

      {/* Call to action — centred over the lower edge, above the artwork. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-6 pb-8 sm:pb-10">
        <Link
          href="/shop"
          className="inline-flex min-h-[54px] items-center justify-center rounded-sm bg-white px-12 text-[12px] font-semibold uppercase tracking-[0.22em] text-charcoal shadow-[0_12px_30px_-10px_rgba(0,0,0,0.55)] transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:bg-white/90 sm:text-[13px]"
        >
          למעבר לקולקציה
        </Link>
      </div>
    </section>
  );
}
