import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductDetail from "@/components/ProductDetail";
import type { SilverProduct } from "@/components/SilverGrid";
import { getProductWithVariants, getLivePriceMap } from "@/lib/shopify";
import { overlayLivePrices } from "@/lib/catalog";
import { buildProductJsonLd, jsonLdHtml } from "@/lib/seo";
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
  const title = `${product.name} | כסף סטרלינג 925 טהור | Oridor`;
  const description = `${product.name} מכסף סטרלינג 925 טהור בציפוי רודיום — עמיד, היפואלרגני ולנצח מבריק. עיצוב על-זמני, משלוח חינם ואחריות מלאה.`;
  const image = `${SITE_URL}${encodeURI(product.image_url)}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/collections/silver/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/collections/silver/${product.slug}`,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
  };
}

export default async function SilverProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const live = await getLivePriceMap();
  const products = overlayLivePrices(data as SilverProduct[], live);
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

  const productJsonLd = buildProductJsonLd({
    name: product.name,
    images: [`${SITE_URL}${encodeURI(product.image_url)}`],
    description: `${product.name} מכסף סטרלינג 925 טהור בציפוי רודיום — עמיד, היפואלרגני ועל-זמני.`,
    sku: product.id,
    path: `/collections/silver/${product.slug}`,
    price: product.price,
    material: product.material,
  });

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(productJsonLd) }}
      />
      <AnnouncementBar />
      <Navbar />

      <ProductDetail
        breadcrumbHref="/collections/silver"
        breadcrumbLabel="קולקציית כסף"
        eyebrow="קולקציית כסף"
        title={product.name}
        category={product.category}
        slug={product.slug}
        allProducts={products}
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
