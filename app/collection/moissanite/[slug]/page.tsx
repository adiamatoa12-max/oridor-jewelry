import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductDetail from "@/components/ProductDetail";
import type { MoissaniteProduct } from "@/components/MoissaniteGrid";
import { getProductWithVariants } from "@/lib/shopify";
import data from "@/data/moissanite_collection.json";

const products = data as MoissaniteProduct[];
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
    description: `${product.name} · ${product.carat} קראט · ${product.material}.`,
  };
}

export default async function MoissaniteProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  // Live Shopify options + variants for the buy box (null → local fallback).
  const shopifyProduct = await getProductWithVariants(product.slug);

  // Product structured data (Schema.org) for rich search results.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `${SITE_URL}${encodeURI(product.image_url)}`,
    description: `${product.name} · ${product.carat} קראט · ${product.material}`,
    material: product.material,
    brand: { "@type": "Brand", name: "Oridor" },
    offers: {
      "@type": "Offer",
      priceCurrency: "ILS",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/collection/moissanite/${product.slug}`,
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
        breadcrumbHref="/collection/moissanite"
        breadcrumbLabel="קולקציית מואסניט"
        eyebrow="מואסניט"
        title={product.name}
        images={[
          { src: encodeURI(product.image_url), alt: `${product.name} — ${product.material}` },
          ...(product.hover_image
            ? [{ src: encodeURI(product.hover_image), alt: `${product.name} בעיצוב על הדוגמנית` }]
            : []),
        ]}
        fit="contain"
        fallbackPrice={product.price}
        compareAtPrice={product.compare_at_price}
        shopifyProduct={shopifyProduct}
        qualityNote="איכות ואותנטיות — כסף 925 ומואסניט D / VVS1"
        showRingGuide={/ring|טבעת/i.test(product.name)}
        description="אבן מואסניט נוצצת בעבודת יד מדויקת, משובצת בכסף 925 טהור מצופה רודיום לברק עמיד ולהגנה מרבית. פריט על-זמני שנועד ללוות אתכן לכל החיים."
        materials={
          <dl className="space-y-2">
            <div className="flex gap-2">
              <dt className="text-ash">חומר:</dt>
              <dd>כסף סטרלינג 925 טהור בציפוי רודיום</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ash">אבן:</dt>
              <dd>מואסניט בדרגת D / VVS1</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ash">משקל אבן:</dt>
              <dd>{product.carat} קראט</dd>
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
