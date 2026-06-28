"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";

interface BestSeller {
  id: string;
  title: string;
  price: number;
  image: string;
  href: string;
}

const PRODUCTS: BestSeller[] = [
  {
    id: "lumen",
    title: "שרשרת תליון Lumen",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    href: "/necklaces",
  },
  {
    id: "etoile",
    title: "עגילי חישוק Étoile",
    price: 165,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    href: "/earrings",
  },
  {
    id: "filament",
    title: "צמיד שרשרת Filament",
    price: 190,
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=800",
    href: "/bracelets",
  },
  {
    id: "aria",
    title: "טבעת סוליטר Aria",
    price: 280,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    href: "/rings",
  },
  {
    id: "celeste",
    title: "שרשרת Celeste",
    price: 245,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    href: "/necklaces",
  },
  {
    id: "mira",
    title: "עגילי צמוד Mira",
    price: 140,
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
    href: "/earrings",
  },
];

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/**
 * "Best Sellers" — a sleek horizontal product carousel.
 * Scroll-snap row with hidden scrollbar; cards have a portrait image, centered
 * details, and a minimal outline Quick Add. Graphite/white, RTL-native.
 */
export default function BestSellers() {
  const { openCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openCart();
  };

  return (
    <section className="py-24 lg:py-32">
      {/* Header */}
      <div className="mb-12 px-6 text-center sm:px-10 lg:px-16">
        <h2 className="text-3xl font-light leading-relaxed tracking-wide text-charcoal">
          הנמכרים ביותר
        </h2>
        <p className="mt-3 text-sm font-light text-graphite">
          הפריטים האהובים ביותר על הלקוחות שלנו
        </p>
      </div>

      {/* Carousel */}
      <div className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 sm:px-10 lg:gap-8 lg:px-16">
        {PRODUCTS.map((p) => (
          <article
            key={p.id}
            className="w-64 shrink-0 snap-start md:w-80"
          >
            <Link href={p.href} className="group block">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F8F8F8] ring-1 ring-platinum/40">
                <Image
                  src={p.image}
                  alt={`${p.title} — תכשיט כסף מבית Oridor`}
                  fill
                  sizes="(min-width: 768px) 20rem, 16rem"
                  className="object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </div>

              <div className="mt-5 text-center">
                <h3 className="text-sm font-normal tracking-wide text-charcoal">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm font-light text-gray-500">
                  {formatPrice(p.price)}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleAdd}
              aria-label={`הוספה מהירה — ${p.title}`}
              className="btn-ghost mt-4 w-full"
            >
              הוספה מהירה
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
