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

/**
 * VaultReward3D — the interactive VIP Vault reward.
 * The Spline robot renders on a WebGL canvas; the selected gift is presented
 * "in its hands" as a lightweight, light-reflecting rendering that swaps with
 * the shopper's choice. A focused white-crystal halo radiates from the held
 * item (replacing the old broad gold wash) for a high-key unlock feel.
 */
export default function VaultReward3D({
  show,
  selectedGift = null,
}: {
  show: boolean;
  selectedGift?: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!show) return;
    // Fresh attempt on every unlock/open — a past transient failure
    // (network blip, stale dev chunk) shouldn't hide the reward forever.
    setFailed(false);
    let app: { dispose: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const { Application } = await import("@splinetool/runtime");
        if (cancelled || !canvasRef.current) return;
        const instance = new Application(canvasRef.current);
        app = instance;
        await instance.load(SPLINE_SCENE_URL);
        if (!cancelled) setSceneReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      setSceneReady(false);
      app?.dispose();
    };
  }, [show]);

  if (failed) return null;

  const HeldItem = (selectedGift && GIFT_RENDERERS[selectedGift]) || EmptyTrayItem;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="vault-reward"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.35 } }}
          transition={{ duration: 0.9, times: [0, 0.65, 1], ease: [0.34, 1.56, 0.64, 1] }}
          className="relative mx-auto mt-4 h-48 w-full overflow-hidden rounded-md"
        >
          {!sceneReady && (
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-light tracking-[0.2em] text-gold">
              ✦ טוען את הכספת ✦
            </div>
          )}

          {/* The robot */}
          <canvas
            ref={canvasRef}
            className={`relative h-full w-full transition-opacity duration-700 ${
              sceneReady ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Held gift — presented at the robot's hands (lower center).
              Crossfade + rise on every selection change. */}
          {sceneReady && (
            <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedGift ?? "empty"}
                  initial={{ opacity: 0, y: 14, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.85, transition: { duration: 0.18 } }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className="relative"
                >
                  {/* Focused white-crystal halo radiating from the item */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 h-28 w-40 -translate-x-1/2 -translate-y-1/2 rounded-[50%] transition-opacity duration-700 ${
                      selectedGift ? "opacity-95" : "opacity-45"
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
      )}
    </AnimatePresence>
  );
}
