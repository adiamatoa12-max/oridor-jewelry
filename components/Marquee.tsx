const PHRASES = [
  "כסף 925 טהור",
  "אחריות לכל החיים",
  "עיצוב נצחי",
  "משלוחים חינם מעל ₪299",
];

/**
 * Infinite horizontal marquee.
 * Two identical tracks slide -50% in a seamless loop. Pure CSS animation,
 * pauses on hover, and respects reduced-motion preferences.
 */
export default function Marquee() {
  // One full pass of the phrases, joined by delicate dots.
  const segment = PHRASES.join("  •  ");

  return (
    <div className="overflow-hidden border-y border-platinum/60 bg-[#F8F8F8] py-3.5">
      <div className="flex w-max animate-marquee whitespace-nowrap motion-reduce:animate-none">
        {[0, 1].map((track) => (
          <span
            key={track}
            aria-hidden={track === 1}
            className="px-6 text-xs font-light tracking-wide text-[#2B2C2F]"
          >
            {segment}  •  {segment}
          </span>
        ))}
      </div>
    </div>
  );
}
