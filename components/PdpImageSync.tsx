"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface PdpImageSync {
  /** Image src the buy box wants the gallery to show (null = gallery default). */
  activeSrc: string | null;
  setActiveSrc: (src: string | null) => void;
}

const PdpImageSyncContext = createContext<PdpImageSync | null>(null);

/**
 * Bridges the color-swatch selector (ProductBuyBox) and the gallery
 * (ProductGallery), which are sibling components. When a swatch is chosen the
 * buy box writes that variant's image src here; the gallery reads it and swaps
 * the main image instantly.
 */
export function PdpImageSyncProvider({ children }: { children: ReactNode }) {
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  // Memoised so consumers only re-render when activeSrc genuinely changes; an
  // inline object literal here would hand every consumer a fresh identity on
  // each render.
  const value = useMemo(() => ({ activeSrc, setActiveSrc }), [activeSrc]);
  return (
    <PdpImageSyncContext.Provider value={value}>
      {children}
    </PdpImageSyncContext.Provider>
  );
}

/** Returns the sync context, or null when rendered outside a provider. */
export function usePdpImageSync() {
  return useContext(PdpImageSyncContext);
}
