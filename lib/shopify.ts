/**
 * Shopify Storefront API client.
 *
 * Credentials come from environment variables (see .env.local):
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN            e.g. your-store.myshopify.com
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN public Storefront API token
 *
 * The Storefront token is designed to be public (read-only, client-safe), so
 * the NEXT_PUBLIC_ prefix is appropriate here. Never expose an Admin API token.
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = "2024-10";

const ENDPOINT = DOMAIN
  ? `https://${DOMAIN}/api/${API_VERSION}/graphql.json`
  : "";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  /** Minimum variant price. */
  price: number;
  currencyCode: string;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
}

/* Raw GraphQL response shapes (before normalization). */
interface MoneyV2 {
  amount: string;
  currencyCode: string;
}
interface ProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  priceRange: { minVariantPrice: MoneyV2 };
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
}

/* ------------------------------------------------------------------ */
/* Low-level fetch                                                     */
/* ------------------------------------------------------------------ */

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

/**
 * Execute a GraphQL query against the Storefront API.
 * Throws on network / GraphQL errors so callers can handle gracefully.
 */
export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  // Cache for 1 minute by default; pass { cache: "no-store" } for live data.
  init: RequestInit & { next?: { revalidate?: number } } = {
    next: { revalidate: 60 },
  },
): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new Error(
      "Shopify is not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local.",
    );
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    ...init,
  });

  if (!res.ok) {
    throw new Error(`Shopify request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  if (!json.data) {
    throw new Error("Shopify returned no data.");
  }

  return json.data;
}

/** True when both env vars are present — lets pages fall back to local data. */
export const isShopifyConfigured = Boolean(DOMAIN && TOKEN);

/* ------------------------------------------------------------------ */
/* Normalization                                                       */
/* ------------------------------------------------------------------ */

function normalizeProduct(node: ProductNode): ShopifyProduct {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    availableForSale: node.availableForSale,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
    featuredImage: node.featuredImage,
    images: node.images.edges.map((e) => e.node),
  };
}

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 6) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

/**
 * Fetch a page of products from the store.
 * @param first  How many products to return (default 24).
 */
export async function getProducts(first = 24): Promise<ShopifyProduct[]> {
  const query = /* GraphQL */ `
    ${PRODUCT_FRAGMENT}
    query Products($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: { node: ProductNode }[] };
  }>(query, { first });

  return data.products.edges.map((e) => normalizeProduct(e.node));
}

/** Live commercial status for one product, keyed by handle. */
export interface LiveStatus {
  price: number;
  currencyCode: string;
  available: boolean;
}

/**
 * Fetch a { handle → live price/availability } map for the whole store.
 *
 * Used by the hybrid data layer: local JSON drives the rich UI (hover images,
 * swatches, sets), while THIS overlays live price + stock matched by handle.
 * Never throws — returns {} if Shopify is unconfigured or the request fails, so
 * pages transparently fall back to their local prices.
 */
export async function getLivePriceMap(): Promise<Record<string, LiveStatus>> {
  if (!isShopifyConfigured) return {};
  const query = /* GraphQL */ `
    query LiveStatus($first: Int!) {
      products(first: $first) {
        edges {
          node {
            handle
            availableForSale
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  `;
  try {
    const data = await shopifyFetch<{
      products: {
        edges: {
          node: {
            handle: string;
            availableForSale: boolean;
            priceRange: { minVariantPrice: MoneyV2 };
          };
        }[];
      };
    }>(query, { first: 250 });

    const map: Record<string, LiveStatus> = {};
    for (const { node } of data.products.edges) {
      map[node.handle] = {
        price: parseFloat(node.priceRange.minVariantPrice.amount),
        currencyCode: node.priceRange.minVariantPrice.currencyCode,
        available: node.availableForSale,
      };
    }
    return map;
  } catch {
    return {};
  }
}

/**
 * Fetch a single product by its handle (URL slug). Returns null if not found.
 */
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = /* GraphQL */ `
    ${PRODUCT_FRAGMENT}
    query Product($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
  `;

  const data = await shopifyFetch<{ product: ProductNode | null }>(query, {
    handle,
  });

  return data.product ? normalizeProduct(data.product) : null;
}
