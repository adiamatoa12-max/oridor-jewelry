import { useEffect, type RefObject } from "react";

/**
 * Force a background <video> to autoplay inline, silently, on every browser —
 * and NEVER park on a tap-to-play button.
 *
 * The four HTML attributes (autoplay/muted/loop/playsinline) alone aren't enough
 * on iOS Safari: it only grants muted-autoplay when `muted` is a DOM PROPERTY,
 * and React does not reliably emit the `muted` attribute from JSX. So we set the
 * property here and retry `.play()` on mount, on each readiness event, on short
 * timers, and whenever the tab returns to the foreground.
 *
 * Pair with a `<video autoPlay muted loop playsInline webkit-playsinline>` (the
 * <AutoplayVideo> component wires all of that up).
 */
export function useAutoplayVideo(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // iOS grants muted-autoplay only when `muted` is set as a DOM property (and
    // defaultMuted), not merely the attribute — otherwise it paints the
    // tap-to-play overlay. Force it before playing.
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
    const timers = [150, 400, 1000, 2000].map((ms) => window.setTimeout(tryPlay, ms));
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
  }, [ref]);
}
