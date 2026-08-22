import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getLiveCatalog } from "@/lib/catalog";

// Product URLs come live from Shopify, so the sitemap always reflects the
// current catalog. Revalidate hourly.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/shop",
    "/collections/moissanite",
    "/collections/silver",
    "/collections/earrings",
    "/collections/tennis",
    "/quality-warranty",
    "/ring-size-guide",
    "/faq",
    "/terms",
    "/contact",
    "/shipping",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  // Every live product resolves to its canonical /products/<handle> page.
  const catalog = await getLiveCatalog();
  const productRoutes = catalog.map((p) => ({
    url: `${SITE_URL}/products/${encodeURIComponent(p.handle)}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
