import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductDetail from "@/components/ProductDetail";
import type { NewArrival } from "@/components/NewArrivalsGrid";
import { getProductWithVariants, getLivePriceMap } from "@/lib/shopify";
import { overlayLivePrices } from "@/lib/catalog";
import { buildProductJsonLd } from "@/lib/seo";
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
  const title = `${product.name} | חדש בכסף 925 | Oridor`;
  const description = `${product.name} מכסף סטרלינג 925 טהור בציפוי רודיום — עיצוב חדש, נקי ועל-זמני. משלוח חינם ואחריות מלאה על כל פריט.`;
  const image = `${SITE_URL}${encodeURI(product.image_url)}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/collections/new/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/collections/new/${product.slug}`,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
  };
}

export default async function NewArrivalProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const live = await getLivePriceMap();
  const products = overlayLivePrices(data as NewArrival[], live);
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const shopifyProduct = await getProductWithVariants(product.slug);

  const productJsonLd = buildProductJsonLd({
    name: product.name,
    images: [`${SITE_URL}${encodeURI(product.image_url)}`],
    description: `${product.name} מכסף סטרלינג 925 טהור בציפוי רודיום — עיצוב חדש, נקי ועל-זמני.`,
    sku: product.id,
    path: `/collections/new/${product.slug}`,
    price: product.price,
    material: product.material,
  });

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <AnnouncementBar />
      <Navbar />

      <ProductDetail
        breadcrumbHref="/collections/new"
        breadcrumbLabel="קולקציה חדשה"
        eyebrow="קולקציה חדשה"
        title={product.name}
        category={product.category}
        slug={product.slug}
        allProducts={products}
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
