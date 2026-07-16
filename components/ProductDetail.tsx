import Link from "next/link";
import { ShieldCheck, Star } from "lucide-react";
import ProductGallery, { type GalleryImage } from "./ProductGallery";
import ProductBuyBox from "./ProductBuyBox";
import SizeGuideModal from "./SizeGuideModal";
import Accordion, { type AccordionItem } from "./Accordion";
import QualityGuarantee from "./QualityGuarantee";
import RelatedProducts from "./RelatedProducts";
import { PdpImageSyncProvider } from "./PdpImageSync";
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
// Quality-assurance selling points — shared across every product so the same
// premium promise appears on every page. Bolded Hebrew terminology anchors the
// key materials and certification.
const QUALITY: AccordionItem = {
  title: "אחריות ואיכות",
  content: (
    <ul className="space-y-2.5">
      <li>
        <strong className="font-semibold text-charcoal">כסף 925 טהור</strong> —
        כסף סטרלינג אמיתי לכל עומקו, מתכת יקרה שנשארת יפה לאורך שנים.
      </li>
      <li>
        <strong className="font-semibold text-charcoal">ציפוי רודיום</strong> —
        שכבת הגנה יוקרתית לברק עמיד ולעמידות מרבית בפני שריטות והחלדה.
      </li>
      <li>
        <strong className="font-semibold text-charcoal">מואסניט D / VVS1</strong>{" "}
        — אבן בדרגת הצבע והניקיון הגבוהה ביותר, בליטוש מושלם (Excellent Cut).
      </li>
      <li>
        <strong className="font-semibold text-charcoal">תעודת אחריות GRA</strong>{" "}
        — כל פריט מגיע עם תעודת אותנטיות ואחריות לכל החיים.
      </li>
    </ul>
  ),
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
  imageByValue,
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
  /** Map of swatch value → gallery image src (switches the main image). */
  imageByValue?: Record<string, string>;
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
    QUALITY,
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

      <PdpImageSyncProvider>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-14">
        {/* Gallery — primary visual anchor: left column on desktop, first on
            mobile (order utilities keep the RTL info panel on the right). */}
        <div className="order-1 md:order-2">
          <ProductGallery images={images} fit={fit} />
        </div>

        {/* Info panel — right column on desktop, below the gallery on mobile */}
        <div className="order-2 flex flex-col md:order-1">
          {/* Title · rating · price read as one cohesive, tightly-spaced unit. */}
          <p className="mb-2.5 text-xs tracking-[0.25em] text-gold">{eyebrow}</p>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-charcoal lg:text-5xl">
            {title}
          </h1>

          {/* Social proof — star rating + review count */}
          <div className="mt-2.5 flex items-center gap-2.5">
            <div className="flex gap-0.5" aria-label="דירוג 5 מתוך 5 כוכבים">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} strokeWidth={0} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="text-xs font-light tracking-wide text-ash">
              מבוסס על 120+ ביקורות
            </span>
          </div>

          {/* Buy box starts with the price (grouped with the title above), then
              the configurator (colour + size), CTA and trust micro-copy. */}
          <ProductBuyBox
            title={title}
            image={images[0]?.src ?? ""}
            fallbackPrice={fallbackPrice}
            compareAtPrice={compareAtPrice}
            product={shopifyProduct}
            hexByValue={hexByValue}
            imageByValue={imageByValue}
            sizes={sizes}
            handle={slug}
          />

          {/* Quality Guarantee stamp — Oridor's premium promise, directly under
              the CTA where buyers seek reassurance before purchasing. */}
          <QualityGuarantee />

          <Link
            href="/quality-warranty"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-light tracking-wide text-graphite underline-offset-4 transition-colors hover:text-gold"
          >
            <ShieldCheck size={14} strokeWidth={1.5} className="text-gold" />
            {qualityNote}
          </Link>

          {showRingGuide && <SizeGuideModal />}

          <div className="mt-8">
            <Accordion defaultOpen={0} items={accordionItems} />
          </div>
        </div>
      </div>
      </PdpImageSyncProvider>

      {/* Related products — "complete the look" */}
      <RelatedProducts items={related} hrefBase={breadcrumbHref} />
    </section>
  );
}
