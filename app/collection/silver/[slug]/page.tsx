import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductDetail from "@/components/ProductDetail";
import type { SilverProduct } from "@/components/SilverGrid";
import { getProductWithVariants } from "@/lib/shopify";
import data from "@/data/silver_collection.json";

const products = data as SilverProduct[];
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oridor.co.il";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return { title: "מוצר לא נמצא" };
  return {
    title: product.name,
    description: `${product.name} · ${product.material} · מקולקציית הכסף של Oridor.`,
  };
}

export default async function SilverProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  // Live Shopify options + variants for the buy box (null → local fallback).
  const shopifyProduct = await getProductWithVariants(product.slug);
  // Map colour value → hex from local variants so swatches keep their tint.
  const hexByValue: Record<string, string> = Object.fromEntries(
    (product.variants ?? []).map((v) => [v.color, v.hex]),
  );

  // Gallery: each colour variant image, else the single product shot.
  const galleryImages =
    product.variants && product.variants.length > 0
      ? product.variants.map((v) => ({
          src: encodeURI(v.image_url),
          alt: `${product.name} — ${v.color}`,
        }))
      : [{ src: encodeURI(product.image_url), alt: `${product.name} — ${product.material}` }];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `${SITE_URL}${encodeURI(product.image_url)}`,
    description: `${product.name} · ${product.material} · קולקציית כסף Oridor`,
    material: product.material,
    brand: { "@type": "Brand", name: "Oridor" },
    offers: {
      "@type": "Offer",
      priceCurrency: "ILS",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/collection/silver/${product.slug}`,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <AnnouncementBar />
      <Navbar />

      <ProductDetail
        breadcrumbHref="/collection/silver"
        breadcrumbLabel="קולקציית כסף"
        eyebrow="קולקציית כסף"
        title={product.name}
        images={galleryImages}
        fit="contain"
        fallbackPrice={product.price}
        compareAtPrice={product.compare_at_price}
        shopifyProduct={shopifyProduct}
        hexByValue={hexByValue}
        qualityNote="איכות ואותנטיות — כסף 925 טהור"
        showRingGuide={/טבעת/.test(product.name)}
        description="פריט מכסף 925 טהור בעבודת יד מדויקת, מלוטש בקפידה לגימור נקי ועל-זמני. עיצוב שנועד ללוות אתכן יום-יום, לשנים רבות."
        materials={
          <dl className="space-y-2">
            <div className="flex gap-2">
              <dt className="text-ash">חומר:</dt>
              <dd>{product.material}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ash">מק״ט:</dt>
              <dd>{product.id}</dd>
            </div>
          </dl>
        }
      />

      <PremiumFooter />
    </main>
  );
}
