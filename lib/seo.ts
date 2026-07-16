/**
 * SEO helpers — shared product structured data (JSON-LD) so every product page
 * emits rich, consistent Schema.org markup that Google can turn into rich
 * snippets (price, availability, shipping, returns).
 *
 * NOTE on aggregateRating: Google only shows review stars for ratings that
 * reflect genuine reviews visible on the page. The value below is kept in sync
 * with the rating shown on the PDP (5 stars · "120+ ביקורות"). Until a real
 * review app (Judge.me / Loox / …) feeds live data, treat these as placeholder
 * marketing figures and be aware that fabricated ratings carry a manual-action
 * risk. Replace PRODUCT_RATING with the app's real aggregate as soon as one is
 * installed — updating it here updates every product page at once.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oridorjewelry.com";

/**
 * Site-wide product rating shown on the PDP. NOT emitted in JSON-LD by default
 * (see buildProductJsonLd) — these are placeholder figures. Once a real review
 * app provides genuine aggregates, pass this (or the app's data) as the
 * `rating` arg to re-enable AggregateRating markup everywhere at once.
 */
export const PRODUCT_RATING = { value: 4.9, count: 120 };

export function buildProductJsonLd(opts: {
  name: string;
  /** Absolute image URLs. */
  images: string[];
  description: string;
  /** SKU / product id. */
  sku: string;
  /** Path on the site, e.g. /collections/moissanite/matan-10 */
  path: string;
  /** Current (launch) price. */
  price: number;
  material: string;
  available?: boolean;
  /** Aggregate rating shown on the page. Defaults to the site-wide figure. */
  rating?: { value: number; count: number } | null;
}) {
  // Default to no aggregateRating: the on-page 5-star / 120+ figures are
  // placeholder marketing, and marking up fabricated ratings risks a Google
  // manual action. Pass an explicit `rating` (e.g. PRODUCT_RATING) only once a
  // real review app feeds genuine, on-page aggregates.
  const rating = opts.rating === undefined ? null : opts.rating;
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: opts.name,
    image: opts.images,
    description: opts.description,
    sku: opts.sku,
    mpn: opts.sku,
    brand: { "@type": "Brand", name: "Oridor" },
    material: opts.material,
    ...(rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.value.toFixed(1),
            reviewCount: rating.count,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}${opts.path}`,
      priceCurrency: "ILS",
      price: opts.price.toFixed(2),
      priceValidUntil: "2026-12-31",
      availability:
        opts.available === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "ILS",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IL",
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IL",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
}

/**
 * Serialize a JSON-LD object for safe inline `<script>` injection. Escapes the
 * few characters that could otherwise break out of the script element
 * (`</script>`) or terminate a JS string — defense-in-depth even though the
 * data is developer-controlled.
 */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
