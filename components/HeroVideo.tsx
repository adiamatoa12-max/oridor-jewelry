"use client";

import { useEffect, useRef } from "react";

/**
 * Decorative cover video for the hero banner.
 *
 * Tuned to always play on entry and to NEVER show a play button or a fallback
 * screen — the video element stays mounted no matter what:
 *  · Full autoplay attribute set — `autoPlay` + `muted` + `loop` + `playsInline`
 *    + the legacy `webkit-playsinline` (older iOS Safari) — the exact combination
 *    mobile browsers require to autoplay inline, silently, with no fullscreen
 *    takeover and no tap-to-play button.
 *  · `preload="auto"` — the clip is fetched eagerly so playback starts instantly.
 *  · `pointer-events-none` — the video can NEVER capture a tap/swipe, so touch
 *    scrolling and the hero CTAs always pass straight through it.
 *  · Aggressive play enforcement — `muted` is forced as a DOM property (iOS only
 *    grants muted-autoplay that way) and `.play()` is retried on mount, on every
 *    readiness event, on short timers and on tab-visible, so it starts the moment
 *    any data is available and never parks on a frozen first frame.
 *  · The dark gradient is only a base UNDERLAY painted behind the video (so the
 *    first frame transitions out of a clean dark surface instead of a flash) —
 *    the video is never replaced by it, so no "fallback screen" ever appears.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // iOS only grants muted-autoplay when `muted` is set as a DOM PROPERTY, not
    // merely the HTML attribute — otherwise it blocks playback and paints the
    // tap-to-play overlay. Force the property (and defaultMuted) before playing.
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");

    const tryPlay = () => {
      if (!v.paused) return;
      v.muted = true;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    tryPlay();
    // Fire on each stage the clip becomes playable.
    const events = ["loadedmetadata", "loadeddata", "canplay", "canplaythrough"];
    events.forEach((e) => v.addEventListener(e, tryPlay));
    // Short timed retries cover a silently-blocked autoplay that fired before
    // any media event.
    const timers = [150, 400, 1000, 2000].map((ms) =>
      window.setTimeout(tryPlay, ms)
    );
    // Resume when the tab returns to the foreground (iOS pauses on background).
    const onVisible = () => {
      if (!document.hidden) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      events.forEach((e) => v.removeEventListener(e, tryPlay));
      timers.forEach((t) => window.clearTimeout(t));
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <>
      {/* Base underlay only — painted behind the video so its first frame
          transitions out of a clean dark surface (never a flash). The video is
          never removed or replaced, so this is not a fallback "screen". */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink via-[#171310] to-charcoal"
      />

      <video
        ref={ref}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_60%]"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        tabIndex={-1}
        // Legacy attribute for older iOS Safari that predates `playsinline`.
        {...({ "webkit-playsinline": "true" } as Record<string, string>)}
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
    </>
  );
}
