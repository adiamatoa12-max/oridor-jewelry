import { shopifyFetch } from "./shopify";

/**
 * Eligible "2+1" gift products, resolved from the store's own Buy X Get Y rule.
 *
 * Why two paths: the Storefront API (the public token the browser uses) does
 * NOT expose discount configuration — `discountNodes` is Admin-only. So the
 * eligible list is read from the Admin API server-side when a token is
 * available, and otherwise falls back to a checked-in mirror of the rule.
 *
 * Product DETAILS (title, image, price) always come live from the Storefront
 * API, so pricing and imagery are never stale in either mode.
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
const ADMIN_API_VERSION = "2024-10";

/**
 * Mirror of the "Get Y" side of the active Buy X Get Y rule
 * ("לקוח קונה 2 מוצרים, מקבל 1 חינם"), used when no Admin token is set.
 * Keep in sync with Shopify → Discounts, or set SHOPIFY_ADMIN_API_ACCESS_TOKEN
 * to have it read the rule directly and make this list irrelevant.
 */
export const FALLBACK_GIFT_HANDLES = [
  "silver-5",
  "silver-44",
  "newarrival-1",
  "newarrival-6",
];

export interface GiftOption {
  /** Storefront variant GID — what add-to-cart needs. */
  variantId: string | null;
  handle: string;
  title: string;
  image: string | null;
  price: number;
}

interface AdminBxgyResponse {
  data?: {
    discountNodes?: {
      edges: {
        node: {
          discount: {
            __typename?: string;
            status?: string;
            customerGets?: {
              items?: {
                products?: { nodes: { handle: string }[] };
              };
            };
          };
        };
      }[];
    };
  };
}

/**
 * Read the eligible gift handles straight from the active BXGY rule.
 * Returns null when no Admin token is configured or the call fails, so the
 * caller can fall back rather than render an empty picker.
 */
async function fetchHandlesFromDiscountRule(): Promise<string[] | null> {
  if (!ADMIN_TOKEN || !DOMAIN) return null;
  try {
    const res = await fetch(
      `https://${DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: `{
            discountNodes(first: 25) {
              edges { node { discount {
                __typename
                ... on DiscountAutomaticBxgy {
                  status
                  customerGets { items {
                    ... on DiscountProducts { products(first: 30) { nodes { handle } } }
                  } }
                }
              } } }
            }
          }`,
        }),
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as AdminBxgyResponse;
    const active = json.data?.discountNodes?.edges
      .map((e) => e.node.discount)
      .find(
        (d) =>
          d.__typename === "DiscountAutomaticBxgy" && d.status === "ACTIVE",
      );
    const handles =
      active?.customerGets?.items?.products?.nodes.map((n) => n.handle) ?? [];
    return handles.length ? handles : null;
  } catch {
    return null;
  }
}

/** Live product details for the given handles, via the public Storefront API. */
async function fetchProducts(handles: string[]): Promise<GiftOption[]> {
  const results = await Promise.all(
    handles.map(async (handle): Promise<GiftOption | null> => {
      try {
        const data = await shopifyFetch<{
          productByHandle: {
            handle: string;
            title: string;
            availableForSale: boolean;
            featuredImage: { url: string } | null;
            priceRange: { minVariantPrice: { amount: string } };
            variants: { edges: { node: { id: string } }[] };
          } | null;
        }>(
          `query GiftProduct($handle: String!) {
            productByHandle(handle: $handle) {
              handle
              title
              availableForSale
              featuredImage { url }
              priceRange { minVariantPrice { amount } }
              variants(first: 1) { edges { node { id } } }
            }
          }`,
          { handle },
          { next: { revalidate: 300 } },
        );
        const p = data.productByHandle;
        if (!p || !p.availableForSale) return null;
        return {
          variantId: p.variants.edges[0]?.node.id ?? null,
          handle: p.handle,
          title: p.title,
          image: p.featuredImage?.url ?? null,
          price: parseFloat(p.priceRange.minVariantPrice.amount),
        };
      } catch {
        return null;
      }
    }),
  );
  return results.filter((g): g is GiftOption => g !== null);
}

/** Eligible gift options for the 2+1 promotion. Never throws. */
export async function getGiftOptions(): Promise<GiftOption[]> {
  const fromRule = await fetchHandlesFromDiscountRule();
  return fetchProducts(fromRule ?? FALLBACK_GIFT_HANDLES);
}
