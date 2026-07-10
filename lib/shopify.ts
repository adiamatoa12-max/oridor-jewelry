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

/* ------------------------------------------------------------------ */
/* Full product with options + variants (for the product buy box)      */
/* ------------------------------------------------------------------ */

export interface ShopifySelectedOption {
  name: string;
  value: string;
}
export interface ShopifyVariant {
  id: string;
  title: string;
  price: number;
  currencyCode: string;
  available: boolean;
  selectedOptions: ShopifySelectedOption[];
}
export interface ShopifyProductOptions {
  handle: string;
  /** Option axes, e.g. [{ name: "צבע", values: ["כסף","זהב","זהב ורוד"] }]. */
  options: { name: string; values: string[] }[];
  variants: ShopifyVariant[];
}

/**
 * Fetch a product's options + variants (with per-variant id, price, stock) by
 * handle. Powers the variant selector on product pages. Returns null when the
 * product isn't found or Shopify is unconfigured (page then falls back to its
 * local single-price buy box).
 */
export async function getProductWithVariants(
  handle: string,
): Promise<ShopifyProductOptions | null> {
  if (!isShopifyConfigured) return null;
  const query = /* GraphQL */ `
    query ProductVariants($handle: String!) {
      product(handle: $handle) {
        handle
        options { name values }
        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              price { amount currencyCode }
              selectedOptions { name value }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await shopifyFetch<{
      product: {
        handle: string;
        options: { name: string; values: string[] }[];
        variants: {
          edges: {
            node: {
              id: string;
              title: string;
              availableForSale: boolean;
              price: MoneyV2;
              selectedOptions: ShopifySelectedOption[];
            };
          }[];
        };
      } | null;
    }>(query, { handle });

    if (!data.product) return null;
    return {
      handle: data.product.handle,
      options: data.product.options,
      variants: data.product.variants.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        price: parseFloat(node.price.amount),
        currencyCode: node.price.currencyCode,
        available: node.availableForSale,
        selectedOptions: node.selectedOptions,
      })),
    };
  } catch {
    return null;
  }
}

/** Live commercial status for one product, keyed by handle. */
export interface LiveStatus {
  price: number;
  /** Regular ("compare at") price when the product is on sale in Shopify. */
  compareAtPrice?: number;
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
            compareAtPriceRange { minVariantPrice { amount } }
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
            compareAtPriceRange: { minVariantPrice: { amount: string } };
          };
        }[];
      };
    }>(query, { first: 250 });

    const map: Record<string, LiveStatus> = {};
    for (const { node } of data.products.edges) {
      const compareAt = parseFloat(
        node.compareAtPriceRange?.minVariantPrice?.amount ?? "0",
      );
      map[node.handle] = {
        price: parseFloat(node.priceRange.minVariantPrice.amount),
        compareAtPrice: compareAt > 0 ? compareAt : undefined,
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

/* ------------------------------------------------------------------ */
/* Cart — real Shopify Storefront cart (checkout-ready)                */
/* ------------------------------------------------------------------ */

export interface ShopifyCartLine {
  /** Cart line id (used to update/remove this line). */
  id: string;
  quantity: number;
  /** Variant GID (merchandise). */
  variantId: string;
  title: string;
  /** Variant/option title, e.g. a colour. Empty for single-variant products. */
  variantTitle: string;
  price: number;
  image: string | null;
}
export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number;
  currencyCode: string;
  lines: ShopifyCartLine[];
}

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { subtotalAmount { amount currencyCode } }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount }
              product { title featuredImage { url } }
            }
          }
        }
      }
    }
  }
`;

interface CartNode {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: MoneyV2 };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          price: { amount: string };
          product: { title: string; featuredImage: { url: string } | null };
        };
      };
    }[];
  };
}

function normalizeCart(node: CartNode): ShopifyCart {
  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    subtotal: parseFloat(node.cost.subtotalAmount.amount),
    currencyCode: node.cost.subtotalAmount.currencyCode,
    lines: node.lines.edges.map(({ node: l }) => ({
      id: l.id,
      quantity: l.quantity,
      variantId: l.merchandise.id,
      title: l.merchandise.product.title,
      // Shopify uses "Default Title" for single-variant products — hide it.
      variantTitle:
        l.merchandise.title === "Default Title" ? "" : l.merchandise.title,
      price: parseFloat(l.merchandise.price.amount),
      image: l.merchandise.product.featuredImage?.url ?? null,
    })),
  };
}

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

/** Create a new cart with the given lines. */
export async function createCart(
  lines: CartLineInput[],
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: CartNode; userErrors: { message: string }[] };
  }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart { ...CartFields }
          userErrors { message }
        }
      }
    `,
    { lines },
    { cache: "no-store" },
  );
  return normalizeCart(data.cartCreate.cart);
}

/** Add lines to an existing cart. */
export async function addCartLines(
  cartId: string,
  lines: CartLineInput[],
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: CartNode };
  }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { message }
        }
      }
    `,
    { cartId, lines },
    { cache: "no-store" },
  );
  return normalizeCart(data.cartLinesAdd.cart);
}

/** Change the quantity of a cart line. */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: CartNode } }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { message }
        }
      }
    `,
    { cartId, lines: [{ id: lineId, quantity }] },
    { cache: "no-store" },
  );
  return normalizeCart(data.cartLinesUpdate.cart);
}

/** Remove a cart line entirely. */
export async function removeCartLine(
  cartId: string,
  lineId: string,
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: CartNode } }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ...CartFields }
          userErrors { message }
        }
      }
    `,
    { cartId, lineIds: [lineId] },
    { cache: "no-store" },
  );
  return normalizeCart(data.cartLinesRemove.cart);
}

/** Fetch an existing cart by id. Returns null if it no longer exists. */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  try {
    const data = await shopifyFetch<{ cart: CartNode | null }>(
      /* GraphQL */ `
        ${CART_FRAGMENT}
        query Cart($cartId: ID!) {
          cart(id: $cartId) { ...CartFields }
        }
      `,
      { cartId },
      { cache: "no-store" },
    );
    return data.cart ? normalizeCart(data.cart) : null;
  } catch {
    return null;
  }
}

/** Resolve the first variant GID for a handle — used by quick-add buttons. */
export async function getFirstVariantId(
  handle: string,
): Promise<string | null> {
  const product = await getProductWithVariants(handle);
  return product?.variants[0]?.id ?? null;
}
