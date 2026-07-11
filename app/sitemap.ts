import type { MetadataRoute } from "next";
import products from "@/data/moissanite_collection.json";
import silver from "@/data/silver_collection.json";
import signature from "@/data/signature_collection.json";
import newArrivals from "@/data/new_arrivals.json";
import type { MoissaniteProduct } from "@/components/MoissaniteGrid";
import type { SilverProduct } from "@/components/SilverGrid";
import type { VariantProduct } from "@/components/VariantCard";
import type { NewArrival } from "@/components/NewArrivalsGrid";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oridor.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/shop",
    "/collections/moissanite",
    "/collections/silver",
    "/collections/signature",
    "/collections/new",
    "/collections/tennis",
    "/sets",
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
    url: `${SITE_URL}/collections/moissanite/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const silverRoutes = (silver as SilverProduct[]).map((p) => ({
    url: `${SITE_URL}/collections/silver/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const signatureRoutes = (signature as VariantProduct[]).map((p) => ({
    url: `${SITE_URL}/collections/signature/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const newArrivalRoutes = (newArrivals as NewArrival[]).map((p) => ({
    url: `${SITE_URL}/collections/new/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...silverRoutes,
    ...signatureRoutes,
    ...newArrivalRoutes,
  ];
}
