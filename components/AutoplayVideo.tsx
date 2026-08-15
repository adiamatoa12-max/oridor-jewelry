"use client";

import { useRef } from "react";
import { useAutoplayVideo } from "./useAutoplayVideo";

/**
 * A decorative background <video> that always autoplays inline, muted, looping —
 * with no tap-to-play button on any device (iOS Safari included).
 *
 * Sets every attribute mobile browsers need explicitly — `autoPlay` + `muted` +
 * `loop` + `playsInline` + the legacy `webkit-playsinline` — and runs
 * `useAutoplayVideo` to force muted-autoplay as a DOM property and keep playback
 * alive. `pointer-events-none` so it never captures a tap/scroll.
 */
export default function AutoplayVideo({
  src,
  className,
  type = "video/mp4",
}: {
  src: string;
  className?: string;
  type?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useAutoplayVideo(ref);

  return (
    <video
      ref={ref}
      className={className}
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
      <source src={src} type={type} />
    </video>
  );
}
