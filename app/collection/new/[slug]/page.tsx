import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import TrustBadges from "@/components/TrustBadges";
import type { NewArrival } from "@/components/NewArrivalsGrid";
import data from "@/data/new_arrivals.json";

const products = data as NewArrival[];
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
    description: `${product.name} · ${product.material} · קולקציה חדשה של Oridor.`,
  };
}

export default function NewArrivalProductPage({
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

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <nav className="mb-10 text-xs font-light tracking-wide text-ash">
          <Link href="/collection/new" className="transition-colors hover:text-charcoal">
            קולקציה חדשה
          </Link>
          <span className="px-2">/</span>
          <span className="text-graphite">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#F8F8F8] ring-1 ring-platinum/40">
            <Image
              src={encodeURI(product.image_url)}
              alt={`${product.name} — ${product.material}`}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-xs tracking-[0.25em] text-gold">קולקציה חדשה</p>
            <h1 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal lg:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-xl font-light text-graphite">{formatPrice(product.price)}</p>

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
            </p>

            <button type="button" className="btn-primary mt-10 w-full sm:w-auto sm:px-16">
              הוספה לאוסף
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16">
          <TrustBadges />
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
