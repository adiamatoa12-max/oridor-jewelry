import Link from "next/link";
import HeroVideo from "./HeroVideo";

/**
 * Video hero — a muted, looping background clip (hero.mp4) with the promo
 * message and collection CTAs composed cleanly on top.
 *
 * The 2+1 message that used to be baked into the static promo image is now real
 * overlaid text, so it stays crisp on any screen and never gets cropped. The
 * <HeroVideo/> child is the autoplay/muted/loop/playsInline background (mobile-
 * hardened, pointer-events-none so touch + the CTAs pass straight through). Two
 * legibility scrims sit between the video and the content; the centred content
 * (eyebrow + headline + tagline + two ghost buttons) is fully responsive.
 */
export default function Hero() {
  const ghost =
    "inline-flex min-h-[48px] flex-1 items-center justify-center whitespace-nowrap rounded-sm border border-white/80 bg-transparent px-4 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 ease-cinematic hover:-translate-y-0.5 hover:bg-white hover:text-charcoal sm:min-h-[52px] sm:flex-none sm:min-w-[190px] sm:px-9 sm:text-[13px] sm:tracking-[0.22em]";

  return (
    <section className="relative h-[70svh] min-h-[480px] w-full overflow-hidden bg-ink sm:h-[72vh] lg:h-[76vh]">
      {/* Looping muted background video (autoplay · muted · loop · playsInline). */}
      <HeroVideo />

      {/* Legibility overlays — an even dim plus a bottom-weighted gradient so the
          white content stays sharp over any frame of the clip. */}
      <div aria-hidden="true" className="absolute inset-0 z-[1] bg-black/30" />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-transparent to-black/60"
      />

      {/* Centred content — sits cleanly on top of the video, responsive. */}
      {/* Mobile: headline centred in the upper space, CTAs anchored low (pt/pb +
          a flex-1 text block). Desktop: the whole group centres together. */}
      <div className="absolute inset-0 z-10 flex flex-col items-center px-6 pb-14 pt-16 text-center [filter:drop-shadow(0_2px_14px_rgba(0,0,0,0.55))] sm:justify-center sm:pb-0 sm:pt-0">
        <div className="flex flex-1 flex-col items-center justify-center sm:flex-none">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.42em] text-white/85 sm:text-[11px]">
            מבצע השקה
          </p>
          <h1 className="text-[40px] font-bold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
            2+1 על כל האתר
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[13px] font-light leading-relaxed tracking-wide text-white/85 sm:mt-6 sm:text-[15px]">
            קני 2 פריטים וקבלי תכשיט שלישי במתנה — יהלומי מואסנייט ותכשיטי כסף 925
            בציפוי רודיום.
          </p>
        </div>

        <div className="mt-8 flex w-full max-w-md flex-none items-center justify-center gap-3 sm:mt-14 sm:w-auto sm:gap-5">
          <Link href="/collections/moissanite" className={ghost}>
            קולקציית מואסנייט
          </Link>
          <Link href="/collections/silver" className={ghost}>
            קולקציית כסף 925
          </Link>
        </div>
      </div>
    </section>
  );
}
