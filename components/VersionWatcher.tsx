"use client";

import { useEffect } from "react";

/** The build this tab loaded with (baked in at build time via next.config). */
const CURRENT = process.env.NEXT_PUBLIC_APP_VERSION || "dev";

/**
 * Keeps already-open tabs on the latest deployment without a manual refresh.
 *
 * It asks /api/version (uncached, always the live deploy) for the current
 * commit SHA and, if it differs from the SHA this tab loaded with, reloads.
 * The check runs when the tab REGAINS focus/visibility — a safe moment that
 * won't interrupt someone mid-scroll or mid-typing — plus a slow background
 * poll as a fallback. No-ops in dev/preview where there is no deploy SHA.
 */
export default function VersionWatcher() {
  useEffect(() => {
    if (CURRENT === "dev") return;

    let stopped = false;
    let reloading = false;

    const check = async () => {
      if (stopped || reloading || document.hidden) return;
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok) return;
        const { v } = (await res.json()) as { v?: string };
        if (v && v !== CURRENT) {
          reloading = true;
          // Reload from the network, not the bfcache, to pull the new build.
          window.location.reload();
        }
      } catch {
        /* offline / transient — try again next time */
      }
    };

    // Re-check whenever the shopper returns to the tab (the safe moment).
    const onVisible = () => {
      if (!document.hidden) check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    // Slow fallback poll (10 min) so a long-lived visible tab still catches up.
    const id = window.setInterval(check, 10 * 60 * 1000);

    return () => {
      stopped = true;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      window.clearInterval(id);
    };
  }, []);

  return null;
}
