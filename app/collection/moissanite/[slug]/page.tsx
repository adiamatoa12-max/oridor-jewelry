import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import type { MoissaniteProduct } from "@/components/MoissaniteGrid";
import ProductBuyBox from "@/components/ProductBuyBox";
import ProductGallery from "@/components/ProductGallery";
import Accordion from "@/components/Accordion";
import TrustBadges from "@/components/TrustBadges";
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

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        {/* Breadcrumb */}
        <nav className="mb-10 text-xs font-light tracking-wide text-ash">
          <Link href="/collection/moissanite" className="transition-colors hover:text-charcoal">
            קולקציית מואסניט
          </Link>
          <span className="px-2">/</span>
          <span className="text-graphite">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-16">
          {/* Gallery — main image + on-model lifestyle shot, hover-to-zoom */}
          <ProductGallery
            fit="contain"
            images={[
              {
                src: encodeURI(product.image_url),
                alt: `${product.name} — ${product.material}`,
              },
              ...(product.hover_image
                ? [
                    {
                      src: encodeURI(product.hover_image),
                      alt: `${product.name} בעיצוב על הדוגמנית`,
                    },
                  ]
                : []),
            ]}
          />

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-xs tracking-[0.25em] text-gold">
              מואסניט
            </p>
            <h1 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal lg:text-4xl">
              {product.name}
            </h1>
            <ProductBuyBox
              title={product.name}
              image={encodeURI(product.image_url)}
              fallbackPrice={product.price}
              compareAtPrice={product.compare_at_price}
              product={shopifyProduct}
            />

            {/* Quality assurance link */}
            <Link
              href="/quality"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-light tracking-wide text-graphite underline-offset-4 transition-colors hover:text-gold"
            >
              <ShieldCheck size={14} strokeWidth={1.5} className="text-gold" />
              איכות ואותנטיות — כסף 925 ומואסניט D / VVS1
            </Link>

            {/* Trust signals below the CTA */}
            <TrustBadges />

            {/* Ring size guide — only for rings */}
            {/ring/i.test(product.name) && (
              <Link
                href="/ring-size-guide"
                className="mt-6 inline-block text-xs font-light tracking-wide text-graphite underline underline-offset-4 transition-colors hover:text-gold"
              >
                מדריך מידות טבעת — איך למדוד בבית
              </Link>
            )}

            {/* Detail accordions */}
            <div className="mt-10">
              <Accordion
                defaultOpen={0}
                items={[
                  {
                    title: "תיאור",
                    content:
                      "אבן מואסניט נוצצת בעבודת יד מדויקת, משובצת בכסף 925 טהור מצופה רודיום לברק עמיד ולהגנה מרבית. פריט על-זמני שנועד ללוות אתכן לכל החיים.",
                  },
                  {
                    title: "חומרים ופרטים",
                    content: (
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
                    ),
                  },
                  {
                    title: "משלוחים והחזרות",
                    content:
                      "משלוח חינם עד הבית לכל ההזמנות, בזמן אספקה של 3–7 ימי עסקים. ניתן להחזיר או להחליף תוך 14 יום ממועד הקבלה — ללא שאלות. כל פריט מגיע עם תעודת אותנטיות ואחריות מלאה.",
                  },
                  {
                    title: "הוראות טיפוח",
                    content:
                      "אחסני את התכשיט במקום יבש והרחיקי אותו ממים, בישום, קרמים וכלור. נקי בעדינות במטלית רכה ויבשה. מומלץ לענוד את התכשיט אחרון ולהסיר אותו ראשון — כך הוא ישמור על הברק לאורך שנים.",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
