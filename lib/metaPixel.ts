/**
 * Meta Pixel event helper.
 *
 * A single safe entry point for standard-event tracking. It no-ops on the
 * server and when fbq hasn't loaded yet (ad-blockers, slow network), so callers
 * can fire freely without guarding every call site.
 *
 * The base pixel (init + PageView) lives in components/MetaPixel.tsx. This file
 * only adds the interaction events layered on top of it.
 *
 * Money: the store trades in ILS, so value-bearing events always send
 * `currency: "ILS"` with a numeric `value`. Meta expects value as a number.
 */

const CURRENCY = "ILS";

type PixelParams = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Fire a standard Meta Pixel event. Silently ignored until fbq is available. */
export function trackPixel(event: string, params?: PixelParams): void {
  if (typeof window === "undefined") return;
  const fbq = window.fbq;
  if (typeof fbq !== "function") return;
  if (params) fbq("track", event, params);
  else fbq("track", event);
}

/**
 * Value-bearing product event (ViewContent, AddToCart). Passes the ILS value
 * and the product identity Meta uses for dynamic-ads matching.
 */
export function trackProductEvent(
  event: "ViewContent" | "AddToCart",
  {
    value,
    contentId,
    contentName,
    quantity = 1,
  }: { value: number; contentId?: string; contentName?: string; quantity?: number },
): void {
  trackPixel(event, {
    value: value * quantity,
    currency: CURRENCY,
    content_type: "product",
    ...(contentId ? { content_ids: [contentId] } : {}),
    ...(contentName ? { content_name: contentName } : {}),
    ...(quantity !== 1 ? { contents: [{ id: contentId, quantity }] } : {}),
  });
}

/** Checkout initiation with cart total and line count. */
export function trackInitiateCheckout({
  value,
  numItems,
  contentIds,
}: {
  value: number;
  numItems: number;
  contentIds?: string[];
}): void {
  trackPixel("InitiateCheckout", {
    value,
    currency: CURRENCY,
    num_items: numItems,
    ...(contentIds && contentIds.length ? { content_ids: contentIds } : {}),
  });
}

/** Search, with the query string Meta records as search_string. */
export function trackSearch(searchString: string): void {
  trackPixel("Search", { search_string: searchString });
}
