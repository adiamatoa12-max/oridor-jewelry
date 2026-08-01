import Image from "next/image";
import Link from "next/link";

/**
 * Promo hero — a single self-contained campaign graphic ("2+1 על כל האתר").
 *
 * The image already carries the full message baked in (the ORIDOR logo, the
 * 2+1 offer and the material tagline), so there is NO overlaid copy or dark
 * scrim to fight with — that would only duplicate/obscure the artwork.
 *
 * Layout: the asset is square (1:1). On mobile the section is itself a square,
 * so the image fills edge-to-edge with zero crop. On desktop it becomes a
 * capped-height banner and the square sits centred on a warm taupe field that
 * matches the image's own background (#A59178), so the letterbox on wide
 * screens reads as an intentional campaign frame rather than empty bars.
 * The whole banner is a link into the shop.
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
          className="object-contain object-center"
        />
      </Link>
    </section>
  );
}
