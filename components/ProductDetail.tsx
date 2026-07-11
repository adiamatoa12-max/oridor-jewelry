import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import ProductGallery, { type GalleryImage } from "./ProductGallery";
import ProductBuyBox from "./ProductBuyBox";
import Accordion, { type AccordionItem } from "./Accordion";
import TrustBadges from "./TrustBadges";
import type { ShopifyProductOptions } from "@/lib/shopify";

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
}) {
  const accordionItems: AccordionItem[] = [
    { title: "תיאור", content: description },
    { title: "חומרים ופרטים", content: materials },
    SHIPPING,
    CARE,
  ];

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
    </section>
  );
}
