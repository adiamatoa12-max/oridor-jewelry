"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  🔁  SWAP YOUR 3D MODEL HERE                                        */
/*  Replace this URL with your own Spline scene export:                */
/*    1. Design your jewelry/vault model at https://app.spline.design  */
/*    2. Export → "Code Export" → copy the .splinecode URL             */
/*    3. Paste it below — nothing else needs to change.                */
/*  (Current placeholder: Spline's public example scene.)              */
/* ------------------------------------------------------------------ */
const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * VaultReward3D — the "wow" moment for unlocking the VIP Vault.
 * Renders a Spline 3D scene onto a <canvas> via @splinetool/runtime
 * (imported dynamically inside useEffect, so the heavy WebGL runtime is
 * fetched only when the vault actually unlocks and never server-bundled).
 * Springs into view with an opulent gold glow via framer-motion.
 */
export default function VaultReward3D({ show }: { show: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!show || !canvasRef.current) return;
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

  // If the 3D scene can't load (offline, blocked), skip the block entirely
  // rather than showing an empty box.
  if (failed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="vault-reward"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.35 } }}
          transition={{ duration: 0.9, times: [0, 0.65, 1], ease: [0.34, 1.56, 0.64, 1] }}
          className="relative mx-auto mt-4 h-44 w-full overflow-hidden rounded-md"
          style={{
            // Opulent, warm gold glow around the reward.
            filter:
              "drop-shadow(0 0 18px rgba(197,160,89,0.55)) drop-shadow(0 6px 30px rgba(197,160,89,0.35))",
          }}
        >
          {/* Soft radial gold wash — pulses while the scene loads */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.22),transparent_70%)] transition-opacity duration-700 ${
              sceneReady ? "opacity-60" : "opacity-100 animate-pulse"
            }`}
          />
          {!sceneReady && (
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-light tracking-[0.2em] text-gold">
              ✦ טוען את הכספת ✦
            </div>
          )}

          <canvas
            ref={canvasRef}
            className={`relative h-full w-full transition-opacity duration-700 ${
              sceneReady ? "opacity-100" : "opacity-0"
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
