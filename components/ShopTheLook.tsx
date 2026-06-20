"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Hotspot {
  id: string;
  /** Position as % from top and from the inline-start (right, in RTL). */
  top: string;
  start: string;
  name: string;
  price: string;
  href: string;
}

// Editorial, high-end fashion portrait with moody lighting and minimal jewelry.
const LOOK_IMAGE =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=900";

const HOTSPOTS: Hotspot[] = [
  { id: "necklace", top: "34%", start: "52%", name: "שרשרת תליון Lumen", price: "₪220", href: "/necklaces" },
  { id: "earring", top: "20%", start: "38%", name: "עגילי חישוק Étoile", price: "₪165", href: "/earrings" },
  { id: "ring", top: "68%", start: "60%", name: "טבעת סוליטר Aria", price: "₪280", href: "/rings" },
];

/**
 * "Shop the Look" — a cinematic editorial image with interactive hotspots.
 * Hover (desktop) or tap (mobile) a pulsing dot to reveal a product tooltip.
 */
export default function ShopTheLook() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mb-10 text-center">
        <p className="mb-3 font-serif text-sm italic tracking-wide text-ash">Shop the Look</p>
        <h2 className="text-3xl font-light leading-relaxed tracking-wide text-charcoal">קני את המראה</h2>
      </div>

      <div className="relative mx-auto aspect-[2/3] w-full max-w-sm overflow-hidden rounded-sm shadow-md">
        <Image
          src={LOOK_IMAGE}
          alt="דוגמנית עונדת שרשרת, עגילים וטבעת מקולקציית Oridor"
          fill
          sizes="(min-width: 640px) 24rem, 100vw"
          className="object-cover"
        />

        {HOTSPOTS.map((spot) => {
          const isOpen = active === spot.id;
          return (
            <div
              key={spot.id}
              className="absolute"
              style={{ top: spot.top, insetInlineStart: spot.start }}
              onMouseEnter={() => setActive(spot.id)}
              onMouseLeave={() => setActive((cur) => (cur === spot.id ? null : cur))}
            >
              {/* Pulsing dot */}
              <button
                type="button"
                aria-label={`הצגת פרטי ${spot.name}`}
                aria-expanded={isOpen}
                onClick={() => setActive((cur) => (cur === spot.id ? null : spot.id))}
                className="relative flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              >
                <span className="absolute h-3.5 w-3.5 rounded-full bg-canvas/90 animate-soft-ping" />
                <span className="relative h-3.5 w-3.5 rounded-full bg-canvas shadow-card ring-1 ring-charcoal/20" />
              </button>

              {/* Tooltip */}
              <div
                role="dialog"
                aria-label={spot.name}
                className={`absolute bottom-full left-0 mb-3 w-48 -translate-x-1/2 rounded-sm bg-canvas/95 p-4 text-center shadow-cardHover backdrop-blur-sm transition-all duration-300 ease-cinematic ${
                  isOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-1 opacity-0"
                }`}
              >
                <p className="text-sm font-normal text-charcoal">{spot.name}</p>
                <p className="mt-1 text-sm font-light text-graphite">{spot.price}</p>
                <Link
                  href={spot.href}
                  className="mt-2 inline-block text-xs tracking-wide text-charcoal underline underline-offset-4 transition-colors hover:text-graphite"
                >
                  צפייה
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
