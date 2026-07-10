import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import type { SilverProduct } from "@/components/SilverGrid";
import ProductBuyBox from "@/components/ProductBuyBox";
import { getProductWithVariants } from "@/lib/shopify";
import data from "@/data/silver_collection.json";

const products = data as SilverProduct[];
const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;
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

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <nav className="mb-10 text-xs font-light tracking-wide text-ash">
          <Link href="/collection/silver" className="transition-colors hover:text-charcoal">
            קולקציית כסף
          </Link>
          <span className="px-2">/</span>
          <span className="text-graphite">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-platinum/40">
            <Image
              src={encodeURI(product.image_url)}
              alt={`${product.name} — ${product.material}`}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain object-center p-6"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-xs tracking-[0.25em] text-gold">קולקציית כסף</p>
            <h1 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal lg:text-4xl">
              {product.name}
            </h1>
            <ProductBuyBox
              title={product.name}
              image={encodeURI(product.image_url)}
              fallbackPrice={product.price}
              product={shopifyProduct}
              hexByValue={hexByValue}
            />

            <Link
              href="/quality"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-light tracking-wide text-graphite underline-offset-4 transition-colors hover:text-gold"
            >
              <ShieldCheck size={14} strokeWidth={1.5} className="text-gold" />
              איכות ואותנטיות — כסף 925 טהור
            </Link>

            <span className="my-8 block h-px w-16 bg-gold" />

            <dl className="space-y-3 text-sm font-light text-graphite">
              <div className="flex gap-2">
                <dt className="text-ash">חומר:</dt>
                <dd>{product.material}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ash">מק״ט:</dt>
                <dd>{product.id}</dd>
              </div>
            </dl>

            <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-graphite">
              פריט מכסף 925 טהור בעבודת יד מדויקת, מלוטש בקפידה לגימור נקי ועל-זמני.
              עיצוב שנועד ללוות אתכן יום-יום, לשנים רבות.
            </p>


            {/* VIP Vault upsell callout */}
            <div className="mt-4 flex max-w-md items-center gap-2 rounded-sm border border-gold/30 bg-cream/70 px-4 py-3">
              <Lock size={14} strokeWidth={1.5} className="flex-none text-gold" />
              <p className="text-xs font-light leading-relaxed tracking-wide text-graphite">
                הוסיפי עוד פריטים ל-₪500 ופתחי את{" "}
                <span className="font-medium text-charcoal">כספת המתנות</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
