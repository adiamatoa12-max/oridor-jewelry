/**
 * Canonical site origin — the single source of truth for every absolute URL the
 * app emits: page canonicals, Open Graph / Twitter tags, JSON-LD, the sitemap
 * and robots.txt.
 *
 * Why a guard and not a bare `process.env.NEXT_PUBLIC_SITE_URL`:
 * shared links (to influencers, on social) MUST point at the production domain.
 * A preview build, or a project env var accidentally set to a `*.vercel.app`
 * host, would otherwise leak that temporary origin into every canonical and OG
 * tag — which 404s when opened inside social apps. So we accept an override
 * ONLY when it is a real, non-preview host; anything else falls back to the
 * production domain. Vercel/preview/localhost origins can never be emitted.
 */

/** The production domain. Every external link resolves here unless a valid
 *  custom-domain override is provided. */
const PRODUCTION_ORIGIN = "https://oridorjewelry.com";

/** Hosts that must never appear in an outbound/shareable URL. */
function isPreviewOrLocalHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return (
    h.endsWith(".vercel.app") ||
    h === "vercel.app" ||
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h === "127.0.0.1" ||
    h === "0.0.0.0" ||
    h === "::1"
  );
}

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return PRODUCTION_ORIGIN;

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    // Malformed override — ignore it rather than emit a broken link.
    return PRODUCTION_ORIGIN;
  }

  // Reject non-https and any preview/dev host so it can never be shared out.
  if (parsed.protocol !== "https:" || isPreviewOrLocalHost(parsed.hostname)) {
    return PRODUCTION_ORIGIN;
  }

  // Valid custom production domain — normalise away any trailing slash so
  // callers can safely do `${SITE_URL}${path}`.
  return parsed.origin;
}

/** Absolute origin (no trailing slash), e.g. `https://oridorjewelry.com`. */
export const SITE_URL = resolveSiteUrl();
