import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductDetail from "@/components/ProductDetail";
import type { NewArrival } from "@/components/NewArrivalsGrid";
import { getProductWithVariants } from "@/lib/shopify";
import data from "@/data/new_arrivals.json";

const products = data as NewArrival[];
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
    description: `${product.name} · ${product.material} · קולקציה חדשה של Oridor.`,
  };
}

export default async function NewArrivalProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const shopifyProduct = await getProductWithVariants(product.slug);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `${SITE_URL}${encodeURI(product.image_url)}`,
    description: `${product.name} · ${product.material} · קולקציה חדשה Oridor`,
    material: product.material,
    brand: { "@type": "Brand", name: "Oridor" },
    offers: {
      "@type": "Offer",
      priceCurrency: "ILS",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/collection/new/${product.slug}`,
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
        breadcrumbHref="/collection/new"
        breadcrumbLabel="קולקציה חדשה"
        eyebrow="קולקציה חדשה"
        title={product.name}
        images={[{ src: encodeURI(product.image_url), alt: `${product.name} — ${product.material}` }]}
        fit="cover"
        fallbackPrice={product.price}
        compareAtPrice={product.compare_at_price}
        shopifyProduct={shopifyProduct}
        qualityNote="איכות ואותנטיות — כסף 925 טהור"
        showRingGuide={/טבעת/.test(product.name)}
        description="פריט מכסף 925 טהור בעבודת יד מדויקת, מלוטש בקפידה לגימור נקי ועל-זמני."
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
