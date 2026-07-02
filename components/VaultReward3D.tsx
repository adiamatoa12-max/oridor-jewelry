"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  🔁  SWAP YOUR 3D MODEL HERE                                        */
/*  Replace this URL with your own Spline scene export:                */
/*    1. Design your jewelry/vault model at https://app.spline.design  */
/*    2. Export → "Code Export" → copy the .splinecode URL             */
/*    3. Paste it below — nothing else needs to change.                */
/* ------------------------------------------------------------------ */
const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/** Give the 3D scene this long to arrive before falling back to 2D. */
const LOAD_TIMEOUT_MS = 10_000;
/** Let the drawer's entrance animation finish before booting WebGL. */
const INIT_DEFER_MS = 400;

/* Gift presentation renderings — lazy-loaded per state so nothing is
   fetched/mounted until the shopper actually picks that gift. */
const TravelBoxItem = lazy(() =>
  import("./VaultGiftItems").then((m) => ({ default: m.TravelBoxItem })),
);
const EarringsItem = lazy(() =>
  import("./VaultGiftItems").then((m) => ({ default: m.EarringsItem })),
);
const CareKitItem = lazy(() =>
  import("./VaultGiftItems").then((m) => ({ default: m.CareKitItem })),
);
const EmptyTrayItem = lazy(() =>
  import("./VaultGiftItems").then((m) => ({ default: m.EmptyTrayItem })),
);

const GIFT_RENDERERS: Record<string, React.ComponentType> = {
  "travel-box": TravelBoxItem,
  studs: EarringsItem,
  "care-kit": CareKitItem,
};

type Status = "idle" | "loading" | "ready" | "failed";

/**
 * VaultReward3D — the interactive VIP Vault reward.
 *
 * Performance contract:
 *  - WebGL boots ONCE per page (not per drawer-open) and is kept alive while
 *    the drawer merely hides — reopening is instant, no re-download/re-parse.
 *  - Boot is deferred until after the entrance animation so they never fight
 *    for the main thread.
 *  - The scene gets LOAD_TIMEOUT_MS to arrive; on timeout/error we gracefully
 *    fall back to the 2D gift presentation on a crystal pedestal — no crash,
 *    no blank box.
 *  - The component stays mounted (animated via variants, not unmounted) so
 *    the canvas/Application are never orphaned mid-load.
 */
export default function VaultReward3D({
  show,
  selectedGift = null,
}: {
  show: boolean;
  selectedGift?: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<{ dispose: () => void } | null>(null);
  const startedRef = useRef(false);
  const [status, setStatus] = useState<Status>("idle");

  // Boot the 3D scene once, on the first unlock.
  useEffect(() => {
    if (!show || startedRef.current) return;
    startedRef.current = true;
    setStatus("loading");
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      try {
        const { Application } = await import("@splinetool/runtime");
        if (cancelled || !canvasRef.current) return;
        const app = new Application(canvasRef.current);
        appRef.current = app;
        await Promise.race([
          app.load(SPLINE_SCENE_URL),
          new Promise((_, reject) =>
            window.setTimeout(() => reject(new Error("timeout")), LOAD_TIMEOUT_MS),
          ),
        ]);
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("failed");
        appRef.current?.dispose();
        appRef.current = null;
      }
    }, INIT_DEFER_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [show]);

  // Dispose WebGL only when the component truly unmounts.
  useEffect(() => () => appRef.current?.dispose(), []);

  const HeldItem = (selectedGift && GIFT_RENDERERS[selectedGift]) || EmptyTrayItem;

  return (
    <motion.div
      initial={false}
      animate={
        show
          ? { height: "12rem", opacity: 1, scale: 1, marginTop: 16 }
          : { height: 0, opacity: 0, scale: 0.92, marginTop: 0 }
      }
      transition={{ duration: 0.55, ease: [0.34, 1.3, 0.64, 1] }}
      className="relative mx-auto w-full overflow-hidden rounded-md"
      aria-hidden={!show}
    >
      {/* Loading — glowing crystal spinner, no blank space */}
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/30 [animation-duration:1.6s]" />
            <span className="absolute inset-1 rounded-full border border-gold/50" />
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold/20 border-t-gold [animation-duration:1.1s]" />
          </span>
          <span className="text-[11px] font-light tracking-[0.2em] text-gold">
            ✦ פותחים את הכספת ✦
          </span>
        </div>
      )}

      {/* The robot — canvas kept mounted so WebGL boots exactly once */}
      <canvas
        ref={canvasRef}
        className={`relative h-full w-full transition-opacity duration-700 ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Held gift / 2D fallback.
          ready  → presented at the robot's hands (bottom of scene)
          failed → becomes the hero of the block, centered on its halo */}
      {(status === "ready" || status === "failed") && (
        <div
          className={`pointer-events-none absolute inset-x-0 flex justify-center ${
            status === "ready" ? "bottom-1" : "inset-y-0 items-center"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedGift ?? "empty"}
              initial={{ opacity: 0, y: 14, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: status === "failed" ? 1.25 : 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.85, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="relative"
            >
              {/* Focused white-crystal halo radiating from the item */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 h-28 w-40 -translate-x-1/2 -translate-y-1/2 rounded-[50%] transition-opacity duration-700 ${
                  selectedGift || status === "failed" ? "opacity-95" : "opacity-45"
                }`}
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(240,246,252,0.55) 38%, rgba(255,255,255,0) 72%)",
                  filter: "blur(2px)",
                }}
              />
              {/* Crystal glints around a chosen item */}
              {selectedGift && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                  <span className="absolute -start-5 top-2 h-1 w-1 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.9)]" />
                  <span className="absolute -end-4 top-6 h-0.5 w-0.5 rounded-full bg-white shadow-[0_0_5px_2px_rgba(255,255,255,0.85)]" />
                  <span className="absolute -end-6 -top-1 h-1 w-1 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.9)]" />
                </div>
              )}

              <Suspense fallback={null}>
                <HeldItem />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
