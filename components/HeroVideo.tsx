"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Decorative cover video for the hero banner.
 *
 * Mobile-hardened for seamless autoplay and against frozen/broken frames:
 *  · Full autoplay attribute set — `autoPlay` + `muted` + `loop` + `playsInline`
 *    + the legacy `webkit-playsinline` (older iOS Safari) — the exact combination
 *    mobile browsers require to autoplay inline, silently, with no fullscreen
 *    takeover and no tap-to-play button.
 *  · `preload="auto"` — the clip is fetched eagerly so playback starts instantly
 *    rather than stalling on entry.
 *  · `pointer-events-none` — the video can NEVER capture a tap/swipe, so touch
 *    scrolling and the hero CTAs always pass straight through it.
 *  · A play-nudge effect — some mobile browsers (backgrounded tab, low-power
 *    mode) skip the initial autoplay; we retry `.play()` on mount, once the clip
 *    can play, and whenever the tab becomes visible again.
 *  · A robust fallback — if the video errors (unsupported/blocked/network) we
 *    flip to `failed` and reveal a branded ink→charcoal gradient in its place,
 *    so the hero reads as an intentional dark backdrop instead of a broken or
 *    frozen frame. The overlaid copy + CTAs stay fully legible either way.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Aggressive autoplay kick: mobile Safari/Chrome sometimes ignore the
    // `autoplay` attribute (low-power mode, backgrounded load, first paint) and
    // park on the first frame with a play button. Explicitly calling .play()
    // across every readiness signal — and a few short retries — forces playback
    // the moment any data is available, so it never freezes on entry.
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
    // A couple of timed retries cover the case where autoplay was silently
    // blocked before any media event fired.
    const t1 = window.setTimeout(tryPlay, 300);
    const t2 = window.setTimeout(tryPlay, 1200);
    // Resume when the tab returns to the foreground (iOS pauses on background).
    const onVisible = () => {
      if (!document.hidden) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      events.forEach((e) => v.removeEventListener(e, tryPlay));
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <>
      {/* Branded fallback — always painted underneath the video so the first
          frame transitions out of a clean dark surface, and shown on its own
          if the video ever fails to load/play (never a frozen or broken frame). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink via-[#171310] to-charcoal"
      />

      {!failed && (
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
          onError={() => setFailed(true)}
          aria-hidden="true"
          tabIndex={-1}
          // Legacy attribute for older iOS Safari that predates `playsinline`.
          {...({ "webkit-playsinline": "true" } as Record<string, string>)}
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}
