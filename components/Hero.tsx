import Image from "next/image";
import Link from "next/link";

/**
 * Promo hero — a single self-contained campaign graphic ("2+1 על כל האתר").
 *
 * The image carries the full message baked in (ORIDOR logo, the 2+1 offer, the
 * material tagline), so there is NO separate overlaid copy.
 *
 * Framing:
 *  - Mobile: the section is a square that matches the 1:1 asset, so
 *    `object-cover` fills it edge-to-edge with the whole graphic in frame.
 *  - Desktop (>=768px): a full-width widescreen banner at 70vh with
 *    `object-cover object-center`, so the image spans the entire screen width
 *    seamlessly (no side margins), the central 2+1 message always framed.
 * A sleek transparent CTA (thin white border) floats over the lower edge.
 */
export default function Hero() {
  return (
    <section className="relative aspect-square w-full overflow-hidden bg-[#A59178] md:aspect-auto md:h-[70vh] md:min-h-[520px]">
      {/* Campaign artwork — cover + centred so it spans full width on desktop. */}
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

      {/* Soft bottom scrim so the transparent CTA stays legible over any tone. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-black/35 to-transparent"
      />

      {/* Call to action — sleek transparent pill with a thin white border. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-6 pb-7 sm:pb-9">
        <Link
          href="/shop"
          className="inline-flex min-h-[52px] items-center justify-center rounded-sm border border-white/75 bg-white/5 px-11 text-[12px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_6px_22px_-10px_rgba(0,0,0,0.55)] backdrop-blur-[2px] transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:bg-white hover:text-charcoal sm:text-[13px]"
        >
          למעבר לקולקציה
        </Link>
      </div>
    </section>
  );
}
