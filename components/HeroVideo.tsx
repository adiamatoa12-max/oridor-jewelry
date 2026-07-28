"use client";

import { useEffect, useRef } from "react";

/**
 * Decorative cover video for the hero banner.
 *
 * Mobile-hardened so it never freezes the page or shows a loading spinner:
 *  · `pointer-events-none` — the video can NEVER capture a tap/swipe, so touch
 *    scrolling and the hero CTAs always pass straight through it. This is the
 *    key guard against "the video froze the page" on mobile.
 *  · `muted` + `playsInline` + `autoPlay` — the exact combination iOS/Android
 *    require to autoplay inline (no fullscreen takeover, no play button).
 *  · `preload="metadata"` — fetches just enough to start rather than eagerly
 *    pulling the whole clip on entry, which is what caused loading stalls on
 *    slow mobile connections.
 *  · A play-nudge effect — some mobile browsers (backgrounded tab, low-power
 *    mode) skip the initial autoplay; we retry `.play()` on mount, once the clip
 *    can play, and whenever the tab becomes visible again. The promise rejection
 *    is swallowed so a blocked autoplay never throws — the dark bg-ink surface
 *    simply shows through as a clean fallback.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    tryPlay();
    v.addEventListener("canplay", tryPlay);
    const onVisible = () => {
      if (!document.hidden) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_60%]"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/video/post_33.mp4" type="video/mp4" />
    </video>
  );
}
