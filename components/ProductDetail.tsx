import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import ProductGallery, { type GalleryImage } from "./ProductGallery";
import ProductBuyBox from "./ProductBuyBox";
import SizeSelector from "./SizeSelector";
import Accordion, { type AccordionItem } from "./Accordion";
import TrustBadges from "./TrustBadges";
import PriceTag from "./PriceTag";
import type { ShopifyProductOptions } from "@/lib/shopify";

// Minimal shape any collection product must satisfy for sizing + related logic.
export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  compare_at_price?: number;
  image_url: string;
  slug: string;
  category?: string;
}

// Available sizes per product category. Edit here to scale — no DB needed.
// Keys are normalized categories (lowercase, singular); "default" is the
// fallback when a product's category isn't listed.
const sizeConfig: Record<string, string[]> = {
  bracelet: ["18cm", "20cm"],
  ring: ["50", "52", "54"],
  necklace: ["40cm", "45cm"],
  default: ["One Size"],
};

/** Resolve the size options for a product's category (falls back to default). */
function sizesForCategory(category?: string): string[] {
  if (!category) return sizeConfig.default;
  const key = category.trim().toLowerCase().replace(/s$/, "");
  return sizeConfig[key] ?? sizeConfig.default;
}

/** First 3 products sharing the category, excluding the current one. */
function getRelatedProducts(
  all: RelatedProduct[] | undefined,
  currentSlug: string | undefined,
  category: string | undefined,
): RelatedProduct[] {
  if (!all || !category) return [];
  return all
    .filter((p) => p.category === category && p.slug !== currentSlug)
    .slice(0, 3);
}

// Shared accordion sections — identical across every collection.
const SHIPPING: AccordionItem = {
  title: "משלוחים והחזרות",
  content:
    "משלוח חינם עד הבית לכל ההזמנות, בזמן אספקה של 3–7 ימי עסקים. ניתן להחזיר או להחליף תוך 14 יום ממועד הקבלה — ללא שאלות. כל פריט מגיע עם תעודת אותנטיות ואחריות מלאה.",
};
const CARE: AccordionItem = {
  title: "הוראות טיפוח",
  content:
    "אחסני את התכשיט במקום יבש והרחיקי אותו ממים, בישום, קרמים וכלור. נקי בעדינות במטלית רכה ויבשה. מומלץ לענוד את התכשיט אחרון ולהסיר אותו ראשון — כך הוא ישמור על הברק לאורך שנים.",
};

/**
 * Unified product-detail layout for every collection (moissanite, silver,
 * signature, new). Editorial gallery + Shopify-driven buy box + trust badges +
 * detail accordions. Pages supply the collection-specific copy; the shared
 * shipping/care sections are appended automatically for consistency.
 */
export default function ProductDetail({
  breadcrumbHref,
  breadcrumbLabel,
  eyebrow,
  title,
  images,
  fit = "contain",
  fallbackPrice,
  compareAtPrice,
  shopifyProduct,
  hexByValue,
  qualityNote,
  description,
  materials,
  showRingGuide = false,
  category,
  slug,
  allProducts,
}: {
  breadcrumbHref: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  images: GalleryImage[];
  fit?: "cover" | "contain";
  fallbackPrice: number;
  compareAtPrice?: number;
  shopifyProduct: ShopifyProductOptions | null;
  hexByValue?: Record<string, string>;
  qualityNote: string;
  /** Product description (accordion, open by default). */
  description: string;
  /** "Materials & details" accordion content (JSX or text). */
  materials: React.ReactNode;
  /** Show the ring-size-guide link (rings only). */
  showRingGuide?: boolean;
  /** Product category — drives the size options and related products. */
  category?: string;
  /** Current product slug — excluded from related products. */
  slug?: string;
  /** Full collection list — used to find related products. */
  allProducts?: RelatedProduct[];
}) {
  const accordionItems: AccordionItem[] = [
    { title: "תיאור", content: description },
    { title: "חומרים ופרטים", content: materials },
    SHIPPING,
    CARE,
  ];

  const sizes = sizesForCategory(category);
  const related = getRelatedProducts(allProducts, slug, category);

  return (
    // Extra mobile bottom padding (pb-28) so the last accordion clears the
    // sticky Add-to-Cart bar, which is only shown on phones.
    <section className="mx-auto max-w-6xl px-6 pb-28 pt-16 sm:px-10 sm:pb-16 lg:px-16 lg:pb-24 lg:pt-24">
      {/* Breadcrumb */}
      <nav className="mb-8 text-xs font-light tracking-wide text-ash">
        <Link href={breadcrumbHref} className="transition-colors hover:text-charcoal">
          {breadcrumbLabel}
        </Link>
        <span className="px-2">/</span>
        <span className="text-graphite">{title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-14">
        {/* Gallery — primary visual anchor: left column on desktop, first on
            mobile (order utilities keep the RTL info panel on the right). */}
        <div className="order-1 md:order-2">
          <ProductGallery images={images} fit={fit} />
        </div>

        {/* Info panel — right column on desktop, below the gallery on mobile */}
        <div className="order-2 flex flex-col md:order-1">
          <p className="mb-3 text-xs tracking-[0.25em] text-gold">{eyebrow}</p>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-charcoal lg:text-5xl">
            {title}
          </h1>

          {/* Config-driven size options (by category) */}
          <SizeSelector sizes={sizes} />

          <ProductBuyBox
            title={title}
            image={images[0]?.src ?? ""}
            fallbackPrice={fallbackPrice}
            compareAtPrice={compareAtPrice}
            product={shopifyProduct}
            hexByValue={hexByValue}
          />

          <Link
            href="/quality"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-light tracking-wide text-graphite underline-offset-4 transition-colors hover:text-gold"
          >
            <ShieldCheck size={14} strokeWidth={1.5} className="text-gold" />
            {qualityNote}
          </Link>

          <TrustBadges />

          {showRingGuide && (
            <Link
              href="/ring-size-guide"
              className="mt-5 inline-block text-xs font-light tracking-wide text-graphite underline underline-offset-4 transition-colors hover:text-gold"
            >
              מדריך מידות טבעת — איך למדוד בבית
            </Link>
          )}

          <div className="mt-8">
            <Accordion defaultOpen={0} items={accordionItems} />
          </div>
        </div>
      </div>

      {/* Related products — "complete the look": same-category pieces */}
      {related.length > 0 && (
        <div className="mt-20 lg:mt-28">
          <h2 className="mb-10 text-center text-2xl font-light tracking-widest text-charcoal">
            משלים את הלוק
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:gap-x-10">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`${breadcrumbHref}/${item.slug}`}
                className="group block bg-transparent transition-transform duration-300 ease-out md:hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-transparent">
                  <Image
                    src={encodeURI(item.image_url)}
                    alt={item.name}
                    fill
                    sizes="(min-width: 768px) 30vw, 50vw"
                    className="object-contain object-center p-4 [filter:drop-shadow(0px_4px_8px_rgba(0,0,0,0.08))] transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="px-2 pt-5 text-center">
                  <h3 className="text-xs font-normal leading-relaxed tracking-[0.08em] text-charcoal transition-colors duration-300 group-hover:text-gold sm:text-[13px]">
                    {item.name}
                  </h3>
                  <PriceTag
                    price={item.price}
                    compareAt={item.compare_at_price}
                    className="mt-2"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
