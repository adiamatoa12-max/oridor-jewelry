"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";

// Editorial lifestyle portrait — the model wearing the full set.
const MODEL_IMAGE = encodeURI("/photo/קולקצית.jpeg");

// The individual pieces she is wearing — close-ups linking to each product.
const PIECES = [
  {
    id: "matan-18",
    name: "שרשרת תליון סוליטר",
    price: 350,
    image: "/photo/מתן 18.jpeg",
    slug: "matan-18",
  },
  {
    id: "matan-24",
    name: "עגילי הילה כפולה",
    price: 420,
    image: "/photo/מתן 24.jpeg",
    slug: "matan-24",
  },
  {
    id: "matan-10",
    name: "טבעת סוליטר עגולה",
    price: 410,
    image: "/photo/מתן 10.jpeg",
    slug: "matan-10",
  },
].map((p) => ({ ...p, image: encodeURI(p.image) }));

const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`;
const setTotal = PIECES.reduce((sum, p) => sum + p.price, 0);

/**
 * "Shop the Full Look" — a two-column editorial section: the model image on one
 * side, a 3-up grid of the exact pieces she's wearing on the other, with CTAs to
 * add the whole set to the cart or browse the items.
 */
export default function ShopTheLook() {
  const { addItem, openCart } = useCart();

  const addFullSet = () => {
    PIECES.forEach((p) =>
      addItem({ id: p.id, title: p.name, price: p.price, image: p.image }),
    );
    openCart();
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-gold">סטייל מושלם</p>
        <h2 className="text-3xl font-light leading-relaxed tracking-widest text-charcoal">
          קני את המראה המלא
        </h2>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left (visually): model image — kept first in DOM so it leads on mobile */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-beige shadow-card lg:order-2">
          <Image
            src={MODEL_IMAGE}
            alt="דוגמנית עונדת את הסט המלא מקולקציית Oridor"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
            priority={false}
          />
        </div>

        {/* Right (visually): 3-up grid of the pieces she's wearing */}
        <div className="flex flex-col lg:order-1">
          <div className="grid flex-1 grid-cols-3 gap-3 lg:gap-4">
            {PIECES.map((p) => (
              <Link
                key={p.id}
                href={`/collection/moissanite/${p.slug}`}
                className="group flex flex-col"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F8F8F8] shadow-card">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 200px, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-cinematic group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-center text-xs font-normal leading-snug tracking-wide text-charcoal">
                  {p.name}
                </p>
                <p className="mt-1 text-center text-xs font-light text-graphite">
                  {formatPrice(p.price)}
                </p>
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={addFullSet} className="btn-primary flex-1">
              הוסף את כל הסט לסל · {formatPrice(setTotal)}
            </button>
            <Link href="/collection/moissanite" className="btn-ghost flex-1 text-center">
              צפה בפריטים
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
