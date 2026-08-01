import Image from "next/image";
import Link from "next/link";

/**
 * Promo hero — a single self-contained campaign graphic ("2+1 על כל האתר").
 *
 * The image already carries the full message baked in (the ORIDOR logo, the
 * 2+1 offer and the material tagline), so there is NO overlaid copy or dark
 * scrim to fight with — that would only duplicate/obscure the artwork.
 *
 * Layout: full-bleed, edge-to-edge — the section spans 100% width with no
 * max-width or padding, and the image is `object-cover` so it always fills the
 * banner. The asset is square (1:1): on mobile the section is itself a square,
 * so the whole image shows with zero crop; on desktop it's a capped-height
 * banner and cover keeps the centred "2+1 על כל האתר" promo in frame while the
 * square's top/bottom are trimmed. The taupe bg (#A59178, the image's own
 * background) is just a load-time fallback now. The whole banner links to /shop.
 */
export default function Hero() {
  return (
    <section className="w-full overflow-hidden bg-[#A59178]">
      <Link
        href="/shop"
        aria-label="מבצע 2+1 על כל האתר — למעבר לחנות"
        className="relative block w-full aspect-square sm:aspect-auto sm:h-[70vh] lg:h-[78vh]"
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
    </section>
  );
}
