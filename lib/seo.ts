/**
 * SEO helpers — shared product structured data (JSON-LD) so every product page
 * emits rich, consistent Schema.org markup that Google can turn into rich
 * snippets (price, availability, shipping, returns).
 *
 * NOTE: aggregateRating is intentionally omitted. Google only shows review
 * stars for genuine first-party reviews shown on the page — fabricated ratings
 * risk a manual penalty. Add it here only once a real review app is installed.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oridor.co.il";

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
}) {
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
