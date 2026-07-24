"use client";

/**
 * Mobile image toggle for product cards — the touch equivalent of the desktop
 * hover swap. Two dots (primary / secondary shot); tapping one sets which image
 * shows. Mobile only (sm:hidden); on desktop the hover swap takes over.
 *
 * Lives on cards whose outer element is a <Link>, so each dot calls
 * preventDefault + stopPropagation: a tap must switch the image, not open the
 * product. This is the same guard the colour swatches use, and it's what keeps
 * the swap off the tap-to-open gesture — the reason a plain `group-active`
 * swap was removed (it cross-faded the photo mid-tap).
 */
export default function MobileImageDots({
  peek,
  onChange,
  title,
}: {
  /** false = primary image shown, true = secondary image shown. */
  peek: boolean;
  onChange: (next: boolean) => void;
  /** Product title, for the dots' accessible labels. */
  title: string;
}) {
  return (
    <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5 sm:hidden">
      {[false, true].map((state) => {
        const on = peek === state;
        return (
          <button
            key={String(state)}
            type="button"
            aria-label={state ? `${title}, תמונה נוספת` : `${title}, תמונה ראשית`}
            aria-pressed={on}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(state);
            }}
            // 28px tap target around a small dot — comfortably tappable without
            // a heavy visual footprint over the photo.
            className="flex h-7 w-7 items-center justify-center"
          >
            <span
              className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ease-out ${
                on ? "w-5 bg-charcoal" : "w-1.5 bg-charcoal/40"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
