import AutoplayVideo from "./AutoplayVideo";

/**
 * Decorative cover video for the hero banner.
 *
 * Always plays on entry and NEVER shows a play button or a fallback screen:
 *  · <AutoplayVideo> sets the full attribute set — `autoPlay` + `muted` + `loop`
 *    + `playsInline` + legacy `webkit-playsinline` — and forces muted-autoplay
 *    as a DOM property with retried `.play()` (the combination iOS Safari needs
 *    to autoplay inline, silently, with no fullscreen takeover or tap-to-play).
 *  · `pointer-events-none` — the video can NEVER capture a tap/swipe, so touch
 *    scrolling and the hero CTAs always pass straight through it.
 *  · The dark gradient is only a base UNDERLAY painted behind the video (so the
 *    first frame transitions out of a clean dark surface instead of a flash) —
 *    the video is never replaced by it, so no "fallback screen" ever appears.
 */
export default function HeroVideo() {
  return (
    <>
      {/* Base underlay only — painted behind the video so its first frame
          transitions out of a clean dark surface (never a flash). The video is
          never removed or replaced, so this is not a fallback "screen". */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink via-[#171310] to-charcoal"
      />

      <AutoplayVideo
        src="/video/hero.mp4"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_60%]"
      />
    </>
  );
}
