/**
 * SEO helpers — shared product structured data (JSON-LD) so every product page
 * emits rich, consistent Schema.org markup that Google can turn into rich
 * snippets (price, availability, shipping, returns).
 *
 * NOTE on aggregateRating: Google only shows review stars for genuine reviews
 * visible on the page. The store has none yet, so no rating is emitted (the
 * fabricated on-page figures were removed). Once a real review app (Judge.me /
 * Loox / …) feeds live data, pass its aggregate as the `rating` arg to enable
 * AggregateRating markup everywhere at once.
 */

import { SITE_URL } from "@/lib/site";

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
  /** Aggregate rating — omit until a real review app provides genuine data. */
  rating?: { value: number; count: number } | null;
  /**
   * Whether this product can be returned. Earrings are excluded for hygiene
   * (see the /shipping policy), so pass false for them to keep the return
   * markup consistent with the visible policy. Defaults to true.
   */
  returnable?: boolean;
}) {
  // Default to no aggregateRating: the store has no genuine reviews yet, and
  // marking up fabricated ratings risks a Google manual action. Pass an
  // explicit `rating` only once a real review app feeds genuine, on-page data.
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
      // Earrings are non-returnable (hygiene), so they emit a "not permitted"
      // policy instead of the 14-day window — matching the /shipping page and
      // the on-page copy.
      hasMerchantReturnPolicy:
        opts.returnable === false
          ? {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "IL",
              returnPolicyCategory:
                "https://schema.org/MerchantReturnNotPermitted",
            }
          : {
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
