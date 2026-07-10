import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductDetail from "@/components/ProductDetail";
import type { VariantProduct } from "@/components/VariantCard";
import { getProductWithVariants } from "@/lib/shopify";
import { buildProductJsonLd } from "@/lib/seo";
import data from "@/data/signature_collection.json";

const products = data as VariantProduct[];
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
  const title = `${product.name} | קולקציית החתימה בכסף 925 | Oridor`;
  const description = `${product.name} מכסף סטרלינג 925 טהור, זמין ב-${product.variants.length} גימורים (כסף, זהב, זהב ורוד). עיצוב חתימה על-זמני, משלוח חינם ואחריות מלאה.`;
  const image = `${SITE_URL}${encodeURI(product.variants[0].image_url)}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/collection/signature/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/collection/signature/${product.slug}`,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
  };
}

export default async function SignatureProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const shopifyProduct = await getProductWithVariants(product.slug);
  const hexByValue: Record<string, string> = Object.fromEntries(
    product.variants.map((v) => [v.color, v.hex]),
  );
  const galleryImages = product.variants.map((v) => ({
    src: encodeURI(v.image_url),
    alt: `${product.name} — ${v.color}`,
  }));

  const productJsonLd = buildProductJsonLd({
    name: product.name,
    images: product.variants.map((v) => `${SITE_URL}${encodeURI(v.image_url)}`),
    description: `${product.name} מכסף סטרלינג 925 טהור — זמין ב-${product.variants.length} גימורים. קולקציית החתימה של Oridor.`,
    sku: product.id,
    path: `/collection/signature/${product.slug}`,
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
        breadcrumbHref="/collection/signature"
        breadcrumbLabel="קולקציית החתימה"
        eyebrow="קולקציית החתימה"
        title={product.name}
        images={galleryImages}
        fit="contain"
        fallbackPrice={product.price}
        compareAtPrice={product.compare_at_price}
        shopifyProduct={shopifyProduct}
        hexByValue={hexByValue}
        qualityNote="איכות ואותנטיות — כסף 925 טהור"
        showRingGuide={/טבעת/.test(product.name)}
        description={`${product.name} — מקולקציית החתימה של Oridor, זמין ב-${product.variants.length} גימורים. עבודת יד מדויקת בכסף 925 טהור, לגימור נקי ועל-זמני.`}
        materials={
          <dl className="space-y-2">
            <div className="flex gap-2">
              <dt className="text-ash">חומר:</dt>
              <dd>{product.material}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ash">גימורים:</dt>
              <dd>{product.variants.map((v) => v.color).join(", ")}</dd>
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
