import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductDetail from "@/components/ProductDetail";
import type { MoissaniteProduct } from "@/components/MoissaniteGrid";
import { getProductWithVariants, getLivePriceMap } from "@/lib/shopify";
import { overlayLivePrices, hasCaratOption, localCaratOptions } from "@/lib/catalog";
import { buildProductJsonLd, jsonLdHtml } from "@/lib/seo";
import data from "@/data/moissanite_collection.json";

const products = data as MoissaniteProduct[];
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oridorjewelry.com";

// Category-specific value phrase for the "[Name] | [Benefit] | Oridor" title.
const BENEFIT: Record<string, string> = {
  Rings: "טבעת מואסניט בכסף 925",
  Necklaces: "שרשרת מואסניט בכסף 925",
  Bracelets: "צמיד מואסניט בכסף 925",
  Earrings: "עגילי מואסניט בכסף 925",
};

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
  const benefit = BENEFIT[product.category ?? ""] ?? "מואסניט זוהר בכסף 925";
  const title = `${product.name} | ${benefit} | Oridor`;
  const description = `${product.name} — מואסניט בדרגת D/VVS1 בכסף סטרלינג 925 מצופה רודיום. ברק עוצר נשימה, משלוח חינם ואחריות מלאה.`;
  const image = `${SITE_URL}${encodeURI(product.image_url)}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/collections/moissanite/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/collections/moissanite/${product.slug}`,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
  };
}

export default async function MoissaniteProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const live = await getLivePriceMap();
  const products = overlayLivePrices(data as MoissaniteProduct[], live);
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  // Live Shopify options + variants for the buy box. When Shopify doesn't yet
  // expose a carat option, synthesise one from the local caratVariants so the
  // PDP still renders the carat selector (and switches price) — no Shopify
  // change required. Add-to-cart routes through the handle for these variants.
  const shopifyProduct = await getProductWithVariants(product.slug);
  const displayProduct =
    hasCaratOption(shopifyProduct) || !product.caratVariants
      ? shopifyProduct
      : localCaratOptions({
          handle: product.slug,
          variants: product.caratVariants,
        });

  // Rich product structured data for Google rich snippets.
  const productJsonLd = buildProductJsonLd({
    name: product.name,
    images: [`${SITE_URL}${encodeURI(product.image_url)}`],
    description: `${product.name} — מואסניט בדרגת D/VVS1 בכסף סטרלינג 925 טהור מצופה רודיום.`,
    sku: product.id,
    path: `/collections/moissanite/${product.slug}`,
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
        breadcrumbHref="/collections/moissanite"
        breadcrumbLabel="קולקציית מואסניט"
        eyebrow="מואסניט"
        title={product.name}
        category={product.category}
        slug={product.slug}
        allProducts={products}
        images={[
          { src: encodeURI(product.image_url), alt: `${product.name} — ${product.material}` },
          ...(product.hover_image
            ? [{ src: encodeURI(product.hover_image), alt: `${product.name} בעיצוב על הדוגמנית` }]
            : []),
          ...(product.gallery_images ?? []).map((src) => ({
            src: encodeURI(src),
            alt: `${product.name} — תצוגה נוספת`,
          })),
        ]}
        fit="contain"
        fallbackPrice={product.price}
        compareAtPrice={product.compare_at_price}
        shopifyProduct={displayProduct}
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
