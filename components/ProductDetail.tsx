import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Gem,
  Sparkles,
  Diamond,
  BadgeCheck,
  Truck,
  RotateCcw,
  Droplets,
  type LucideIcon,
} from "lucide-react";
import ProductGallery, { type GalleryImage } from "./ProductGallery";
import ProductBuyBox from "./ProductBuyBox";
import SizeGuideModal from "./SizeGuideModal";
import Accordion, { type AccordionItem } from "./Accordion";
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
  // Hebrew units throughout — the rest of the storefront is Hebrew, and "cm"
  // mid-sentence in an RTL line reads as a foreign token.
  bracelet: ["16 ס״מ", "17 ס״מ", "18 ס״מ", "16 ס״מ + 5 ס״מ הארכה"],
  ring: ["6", "7", "8", "9"],
  necklace: ["40 ס״מ + 5 ס״מ הארכה", "40–45 ס״מ מתכוונן"],
  default: ["מידה אחידה"],
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

/**
 * Every order ships in the branded box, so the packaging shot closes each
 * product gallery. Appended here rather than in the four collection pages, so
 * it stays consistent everywhere and any future collection inherits it.
 *
 * "cover" fit: it's a styled shot that carries its own background, unlike the
 * cut-out product stills that sit contained on the frame's surface.
 */
const PACKAGING_SLIDE: GalleryImage = {
  src: "/photo/packaging-oridor.jpg",
  alt: "אריזת המותג של Oridor שבה מגיע כל תכשיט",
  fit: "cover",
};

/**
 * One scannable material/benefit row: a gold-tinted icon chip, a bold heading,
 * and a short punchy line beneath it. The building block of the redesigned
 * "חומרים וטיפוח" and "משלוחים והחזרות" sections — reads cleanly on mobile and
 * desktop, with generous spacing so nothing feels cramped.
 */
function HighlightRow({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3.5">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/20"
      >
        <Icon size={16} strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold tracking-wide text-charcoal sm:text-sm">
          {title}
        </p>
        <p className="mt-1 text-[13px] font-light leading-[1.75] text-graphite">
          {children}
        </p>
      </div>
    </li>
  );
}

// Material & certification highlights — shared across every product so the same
// premium promise appears on every page, now as scannable icon rows.
const MATERIAL_HIGHLIGHTS = (
  <ul className="space-y-4">
    <HighlightRow icon={Gem} title="כסף 925 טהור">
      כסף סטרלינג אמיתי לכל עומקו — מתכת יקרה שנשארת יפה לאורך שנים.
    </HighlightRow>
    <HighlightRow icon={Sparkles} title="ציפוי רודיום">
      שכבת הגנה יוקרתית לברק עמיד, שאינו מתקלף ואינו משחיר.
    </HighlightRow>
    <HighlightRow icon={Diamond} title="מואסנייט D / VVS1">
      דרגת הצבע והניקיון הגבוהה ביותר, בליטוש מושלם (Excellent Cut).
    </HighlightRow>
    <HighlightRow icon={BadgeCheck} title="תעודת אחריות GRA">
      כל פריט מגיע עם תעודת אותנטיות ואחריות לכל החיים.
    </HighlightRow>
  </ul>
);

// Daily-care guidance, folded into one calm, punchy line.
const CARE_ROW = (
  <ul className="space-y-4">
    <HighlightRow icon={Droplets} title="טיפוח יומיומי">
      אחסני במקום יבש והרחיקי ממים, מבישום ומכלור. נקי בעדינות במטלית רכה. עונדי
      אחרון ומסירי ראשון — כך הברק נשמר לאורך שנים.
    </HighlightRow>
  </ul>
);

// Shipping & returns — three scannable rows. Terms must match the /shipping
// policy page and the JSON-LD in lib/seo.ts exactly: free shipping, 14-day
// return in original unused packaging, earrings excluded for hygiene.
const SHIPPING_ROWS = (
  <ul className="space-y-4">
    <HighlightRow icon={Truck} title="משלוח חינם עד הבית">
      לכל ההזמנות, באספקה של 3–7 ימי עסקים.
    </HighlightRow>
    <HighlightRow icon={RotateCcw} title="14 יום להחזרה או החלפה">
      באריזה המקורית וללא שימוש. מטעמי היגיינה, עגילים אינם ניתנים להחזרה או
      להחלפה.
    </HighlightRow>
    <HighlightRow icon={ShieldCheck} title="אחריות ותעודת אותנטיות">
      כל פריט מגיע עם תעודה ואחריות מלאה.
    </HighlightRow>
  </ul>
);

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
  authenticity,
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
  /**
   * Optional authenticity/presentation band shown below the product grid.
   * Collection-level rather than per-product: the same certificate imagery
   * applies to every piece in the collection that ships with one.
   */
  authenticity?: { src: string; alt: string; heading: string; body: string };
}) {
  // Three collapsible sections (Product Story · Materials & Care ·
  // Shipping/Returns). Materials & Care folds together the page's materials
  // copy, the shared quality guarantees, and the care instructions.
  const accordionItems: AccordionItem[] = [
    {
      title: "סיפור המוצר",
      content: (
        <p className="text-[15px] font-light leading-[1.85] text-graphite sm:text-sm">
          {description}
        </p>
      ),
    },
    {
      title: "חומרים וטיפוח",
      content: (
        <div className="space-y-6">
          {/* Material & certification highlights — the visual centrepiece */}
          {MATERIAL_HIGHLIGHTS}

          {/* Per-product spec, set apart as a quiet, tabular block. The pages
              pass their own <dl>; we only frame it with a hairline + sizing. */}
          <div className="border-t border-platinum/50 pt-5 text-[13px] [&_dt]:text-ash [&_dd]:text-charcoal">
            {materials}
          </div>

          {/* Daily care, above a hairline so it reads as its own note */}
          <div className="border-t border-platinum/50 pt-5">{CARE_ROW}</div>
        </div>
      ),
    },
    { title: "משלוחים והחזרות", content: SHIPPING_ROWS },
  ];

  const sizes = sizesForCategory(category);
  const related = getRelatedProducts(allProducts, slug, category);

  // Packaging shot always closes the gallery. Guarded so a page that already
  // supplies it can't end up with the slide twice.
  const galleryImages: GalleryImage[] = images.some(
    (i) => i.src === PACKAGING_SLIDE.src,
  )
    ? images
    : [...images, PACKAGING_SLIDE];

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
          <ProductGallery images={galleryImages} fit={fit} />
        </div>

        {/* Info panel — right column on desktop, below the gallery on mobile */}
        <div className="order-2 flex flex-col md:order-1">
          {/* Title · rating · price read as one cohesive, tightly-spaced unit. */}
          <p className="mb-2.5 text-xs tracking-[0.25em] text-gold">{eyebrow}</p>
          {/* 24px/bold on mobile — the premium-mobile standard. Desktop keeps
              the editorial display size, where a 48px title has room to work. */}
          {/* Mobile line-height is 1.35, not the desktop 1.05. Tight leading is
              a display-type device: it reads as confident at 48px and as
              cramped at 24px, which is what made the mobile block feel dense. */}
          <h1 className="text-2xl font-bold leading-[1.35] tracking-tight text-charcoal sm:text-5xl sm:font-semibold sm:leading-[1.05] lg:text-6xl">
            {title}
          </h1>

          {/* Honest trust line in place of the old fabricated star rating +
              "120+ ביקורות": the guarantees the brand can actually stand behind
              until real customer reviews exist. */}
          <p className="mt-2.5 text-xs font-light tracking-wide text-ash">
            משלוח חינם · אחריות מלאה · תעודת אותנטיות
          </p>

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

          <Link
            href="/quality-warranty"
            className="mt-7 inline-flex items-center gap-1.5 text-xs font-light tracking-wide text-graphite underline-offset-4 transition-colors hover:text-gold"
          >
            <ShieldCheck size={14} strokeWidth={1.5} className="text-gold" />
            {qualityNote}
          </Link>

          {showRingGuide && <SizeGuideModal />}

          {/* Generous gap before the description block — the pause high-end
              brands leave between the commercial ask and the editorial copy. */}
          <div className="mt-12 sm:mt-8">
            <Accordion defaultOpen={0} items={accordionItems} />
          </div>
        </div>
      </div>
      </PdpImageSyncProvider>

      {/* Authenticity band — deliberately NOT in the gallery carousel: this is
          certificate/packaging imagery, identical across the collection, and a
          shopper swiping product shots shouldn't land on it expecting the piece.
          Stacked on mobile, image beside copy from md up. */}
      {authenticity && (
        <section className="mt-16 grid grid-cols-1 items-center gap-8 rounded-2xl bg-cream p-6 ring-1 ring-platinum/40 sm:p-8 md:grid-cols-2 md:gap-12 lg:mt-24">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl sm:aspect-square">
            <Image
              src={encodeURI(authenticity.src)}
              alt={authenticity.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover object-center"
            />
          </div>
          <div>
            <p className="mb-2.5 text-xs tracking-[0.25em] text-gold">אותנטיות</p>
            <h2 className="text-2xl font-bold leading-[1.35] tracking-tight text-charcoal sm:text-3xl sm:font-semibold">
              {authenticity.heading}
            </h2>
            <p className="mt-4 text-base font-light leading-relaxed text-graphite sm:text-sm">
              {authenticity.body}
            </p>
          </div>
        </section>
      )}

      {/* Related products — "complete the look" */}
      <RelatedProducts items={related} hrefBase={breadcrumbHref} />
    </section>
  );
}
