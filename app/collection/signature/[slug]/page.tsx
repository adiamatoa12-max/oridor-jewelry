import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import VariantProductView from "@/components/VariantProductView";
import type { VariantProduct } from "@/components/VariantCard";
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
  return {
    title: product.name,
    description: `${product.name} · ${product.material} · זמין ב${product.variants.length} גימורים — קולקציית החתימה של Oridor.`,
  };
}

export default function SignatureProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.variants.map((v) => `${SITE_URL}${encodeURI(v.image_url)}`),
    description: `${product.name} · ${product.material} · קולקציית החתימה Oridor`,
    material: product.material,
    brand: { "@type": "Brand", name: "Oridor" },
    offers: {
      "@type": "Offer",
      priceCurrency: "ILS",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/collection/signature/${product.slug}`,
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
          <Link href="/collection/signature" className="transition-colors hover:text-charcoal">
            קולקציית החתימה
          </Link>
          <span className="px-2">/</span>
          <span className="text-graphite">{product.name}</span>
        </nav>

        <VariantProductView product={product} />
      </section>

      <PremiumFooter />
    </main>
  );
}
