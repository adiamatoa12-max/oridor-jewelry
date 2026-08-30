import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import ProductDetail from "@/components/ProductDetail";
import { getProduct, getProductWithVariants, isShopifyConfigured } from "@/lib/shopify";
import { cleanProductTitle } from "@/lib/catalog";
import { buildProductJsonLd, jsonLdHtml } from "@/lib/seo";

/**
 * Generic live-product page for the "Hybrid Append" layer (Option B).
 *
 * Curated products keep their rich, hand-designed pages under
 * /collections/<collection>/<slug>. Products that exist in Shopify but aren't in
 * the curated JSON are appended to the shop and link HERE — this route builds a
 * working detail page entirely from live Shopify data (images, price, options,
 * variants), so a brand-new product is shoppable the moment it's published,
 * with no code change.
 */

const CATEGORY_HE: Record<string, string> = {
  Rings: "טבעות",
  Necklaces: "שרשראות",
  Bracelets: "צמידים",
  Earrings: "עגילים",
};

function inferCategory(name: string): string | undefined {
  if (/טבעת|ring/i.test(name)) return "Rings";
  if (/שרשרת|necklace|pendant/i.test(name)) return "Necklaces";
  if (/צמיד|יד|bracelet|bangle/i.test(name)) return "Bracelets";
  if (/עגיל|חישוק|earring|hoop/i.test(name)) return "Earrings";
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  if (!isShopifyConfigured) return { title: "מוצר לא נמצא" };
  // Non-ASCII (Hebrew) handles arrive URL-encoded in params — decode before use.
  const handle = decodeURIComponent(params.handle);
  const product = await getProduct(handle).catch(() => null);
  if (!product) return { title: "מוצר לא נמצא" };
  const title = `${cleanProductTitle(product.title)} | Oridor`;
  const description =
    product.description?.slice(0, 160) ||
    `${product.title} מבית Oridor — כסף סטרלינג 925 טהור, משלוח חינם ואחריות מלאה.`;
  const image = product.featuredImage?.url;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/products/${params.handle}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${params.handle}`,
      type: "website",
      locale: "he_IL",
      siteName: "Oridor",
      images: image ? [{ url: image, alt: product.title }] : undefined,
    },
  };
}

export default async function LiveProductPage({
  params,
}: {
  params: { handle: string };
}) {
  if (!isShopifyConfigured) notFound();

  // Non-ASCII (Hebrew) handles arrive URL-encoded in params — decode before use.
  const handle = decodeURIComponent(params.handle);
  const [product, shopifyProduct] = await Promise.all([
    getProduct(handle).catch(() => null),
    getProductWithVariants(handle).catch(() => null),
  ]);
  if (!product) notFound();

  const displayTitle = cleanProductTitle(product.title);
  const category = inferCategory(product.title);

  // Gallery from every Shopify image (fall back to the featured image).
  const gallery = product.images.length > 0 ? product.images : product.featuredImage ? [product.featuredImage] : [];
  const galleryImages = gallery.map((img) => ({
    src: img.url,
    alt: img.altText ?? displayTitle,
    fit: "contain" as const,
  }));

  const productJsonLd = buildProductJsonLd({
    name: displayTitle,
    images: product.featuredImage ? [product.featuredImage.url] : [],
    description: product.description || `${displayTitle} מבית Oridor.`,
    sku: product.handle,
    path: `/products/${product.handle}`,
    price: product.price,
    material: "כסף 925 טהור בציפוי רודיום",
    returnable: category !== "Earrings",
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
        breadcrumbHref="/shop"
        breadcrumbLabel="הקולקציה המלאה"
        eyebrow={category ? CATEGORY_HE[category] ?? "Oridor" : "Oridor"}
        title={displayTitle}
        category={category}
        slug={product.handle}
        images={galleryImages}
        fit="contain"
        fallbackPrice={product.price}
        shopifyProduct={shopifyProduct}
        showRingGuide={category === "Rings"}
        description={
          product.description ||
          "פריט מכסף 925 טהור בעבודת יד מדויקת, מלוטש בקפידה לגימור נקי ועל-זמני."
        }
        materials={
          <dl className="space-y-2">
            <div className="flex gap-2">
              <dt className="text-ash">חומר:</dt>
              <dd>כסף 925 טהור בציפוי רודיום</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ash">מק״ט:</dt>
              <dd>{product.handle}</dd>
            </div>
          </dl>
        }
      />

      <PremiumFooter />
    </main>
  );
}
