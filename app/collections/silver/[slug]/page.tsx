import { redirect } from "next/navigation";

/**
 * Legacy curated product route. The catalog is now 100% live from Shopify, so
 * every product is served by the generic /products/[handle] page. This route
 * just forwards old/bookmarked links there.
 */
export default function LegacyProductRedirect({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/products/${params.slug}`);
}
