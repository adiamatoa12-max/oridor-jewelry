import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PremiumFooter from "@/components/PremiumFooter";
import type { MoissaniteProduct } from "@/components/MoissaniteGrid";
import data from "@/data/moissanite_collection.json";

const products = data as MoissaniteProduct[];
const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

const FAQS = [
  {
    q: "האם התכשיט מתכהה או מחליד?",
    a: "לא. כל פריט עשוי מכסף סטרלינג 925 מלא ומצופה רודיום, כך שהוא שומר על הברק לאורך זמן ואינו מחליד בשימוש יומיומי. מומלץ לאחסן במקום יבש ולהסיר במגע עם בישום, קרמים או כלור.",
  },
  {
    q: "אחריות",
    a: "כל תכשיט מגיע עם אחריות מלאה ותעודת אותנטיות. ניתן להחזיר או להחליף תוך 30 יום ממועד הקבלה — ללא שאלות.",
  },
  {
    q: "מדידת טבעת",
    a: "לא בטוחות במידה? מדדו היקף של טבעת קיימת שמתאימה לכן, או צרו איתנו קשר בוואטסאפ ונשמח לעזור לכן למצוא את המידה המדויקת לפני ההזמנה.",
  },
];

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return { title: "מוצר לא נמצא — Oridor" };
  return {
    title: `${product.name} — Oridor`,
    description: `${product.name} · ${product.carat} ct · ${product.material}.`,
  };
}

export default function MoissaniteProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        {/* Breadcrumb */}
        <nav className="mb-10 text-xs font-light tracking-wide text-ash">
          <Link href="/collection/moissanite" className="transition-colors hover:text-charcoal">
            קולקציית מואסניט
          </Link>
          <span className="px-2">/</span>
          <span className="text-graphite">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-[#F8F8F8] ring-1 ring-platinum/40">
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
            <p className="mb-3 font-serif text-sm italic tracking-wide text-gold">
              Moissanite
            </p>
            <h1 className="text-3xl font-light leading-relaxed tracking-wide text-charcoal lg:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-xl font-light text-graphite">
              {formatPrice(product.price)}
            </p>

            {/* Quality assurance badge */}
            <Link
              href="/quality"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-light tracking-wide text-graphite underline-offset-4 transition-colors hover:text-gold"
            >
              <ShieldCheck size={14} strokeWidth={1.5} className="text-gold" />
              איכות ואותנטיות — כסף 925 ומואסניט D / VVS1
            </Link>

            <span className="my-8 block h-px w-16 bg-gold" />

            <dl className="space-y-3 text-sm font-light text-graphite">
              <div className="flex gap-2">
                <dt className="text-ash">משקל אבן:</dt>
                <dd>{product.carat} קראט</dd>
              </div>
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
              אבן מואסניט נוצצת בעבודת יד מדויקת, משובצת בכסף 925 טהור מצופה
              רודיום לברק עמיד ולהגנה מרבית. פריט על-זמני שנועד ללוות אתכן לכל
              החיים.
            </p>

            <button
              type="button"
              className="btn-primary mt-10 w-full sm:w-auto sm:px-16"
            >
              הוספה לסל
            </button>

            {/* Ring size guide — only for rings */}
            {/ring/i.test(product.name) && (
              <Link
                href="/ring-size-guide"
                className="mt-4 inline-block text-xs font-light tracking-wide text-graphite underline underline-offset-4 transition-colors hover:text-gold"
              >
                מדריך מידות טבעת — איך למדוד בבית
              </Link>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-2xl border-t border-platinum/50 pt-14">
          <h2 className="mb-8 text-center text-2xl font-light tracking-wide text-charcoal">
            שאלות נפוצות
          </h2>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group px-1 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-normal text-charcoal transition-colors hover:text-gold">
                  {faq.q}
                  <span className="text-ash transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm font-light leading-relaxed text-graphite">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
