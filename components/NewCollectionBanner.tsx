import Image from "next/image";
import Link from "next/link";

/**
 * Editorial hero banner for the new 925-silver collection — a large, high-end
 * visual with an overlaid headline and CTA, placed high on the homepage.
 */
export default function NewCollectionBanner() {
  return (
    <section className="relative h-[62vh] max-h-[560px] min-h-[420px] w-full overflow-hidden bg-mist">
      <Image
        src={encodeURI("/photo/קולקצית.jpeg")}
        alt="קולקציה חדשה — כסף 925 טהור מבית Oridor"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Cinematic scrim so the white text reads on any part of the image */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/15 to-charcoal/10" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-16 text-center md:items-start md:pb-20 md:pe-16 md:ps-16 md:text-start">
        <p className="mb-3 animate-fade-up text-xs tracking-[0.3em] text-white/85 [animation-delay:100ms]">
          הגיעו עכשיו
        </p>
        <h2 className="max-w-xl animate-fade-up text-4xl font-light leading-relaxed tracking-wide text-white [animation-delay:250ms] md:text-5xl">
          קולקציה חדשה
        </h2>
        <p className="mt-4 max-w-md animate-fade-up text-sm font-light leading-relaxed text-white/85 [animation-delay:400ms]">
          כסף סטרלינג 925 טהור ומוצק — נצנוץ על-זמני שנשאר לתמיד.
        </p>
        <Link
          href="/collection/new"
          className="mt-8 inline-flex min-h-[44px] animate-fade-up items-center justify-center border border-white/80 bg-white/10 px-10 py-2.5 text-[11px] uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-all duration-500 ease-cinematic [animation-delay:550ms] hover:bg-white hover:text-charcoal"
        >
          לגילוי הקולקציה
        </Link>
      </div>
    </section>
  );
}
