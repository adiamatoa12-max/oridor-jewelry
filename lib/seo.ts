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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oridor.co.il";

/**
 * Site-wide product rating shown on the PDP and mirrored into JSON-LD so the
 * structured data always matches the visible stars/review count. Single source
 * of truth — swap for a real review-app aggregate when available.
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
  const rating = opts.rating === undefined ? PRODUCT_RATING : opts.rating;
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
