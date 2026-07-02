import type { MetadataRoute } from "next";
import products from "@/data/moissanite_collection.json";
import silver from "@/data/silver_collection.json";
import signature from "@/data/signature_collection.json";
import type { MoissaniteProduct } from "@/components/MoissaniteGrid";
import type { SilverProduct } from "@/components/SilverGrid";
import type { VariantProduct } from "@/components/VariantCard";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oridor.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/shop",
    "/collection/moissanite",
    "/collection/silver",
    "/collection/signature",
    "/quality",
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

  const productRoutes = (products as MoissaniteProduct[]).map((p) => ({
    url: `${SITE_URL}/collection/moissanite/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const silverRoutes = (silver as SilverProduct[]).map((p) => ({
    url: `${SITE_URL}/collection/silver/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const signatureRoutes = (signature as VariantProduct[]).map((p) => ({
    url: `${SITE_URL}/collection/signature/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...silverRoutes, ...signatureRoutes];
}
