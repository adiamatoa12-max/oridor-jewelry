import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

// Verified-loading image pool, cycled to 24 tiles so the grid fills perfectly
// at 4, 6, and 8 columns.
const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
];

const POSTS = Array.from({ length: 24 }, (_, i) => IMAGE_POOL[i % IMAGE_POOL.length]);

/**
 * Instagram lifestyle feed.
 * Centered header, then a full-width gapless grid of square shots. Hovering a
 * tile reveals a soft dark wash with a white Instagram glyph.
 */
export default function InstagramFeed() {
  return (
    <section className="w-full py-24 lg:py-32">
      {/* Header */}
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-light leading-relaxed tracking-wide text-charcoal">
          ההשראה שלכן
        </h2>
        <p className="mt-3 text-sm font-light tracking-wide text-ash">
          @Oridor_Jewelry
        </p>
      </div>

      {/* Gapless grid */}
      <div className="grid grid-cols-4 gap-0 md:grid-cols-6 lg:grid-cols-8">
        {POSTS.map((src, i) => (
          <Link
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="צפייה באינסטגרם של Oridor"
            className="group relative aspect-square overflow-hidden bg-pearl"
          >
            <Image
              src={src}
              alt="תכשיט מ-Oridor בסגנון לייפסטייל"
              fill
              sizes="(min-width: 1024px) 12.5vw, (min-width: 768px) 16vw, 25vw"
              className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
            />
            {/* Hover overlay + Instagram glyph */}
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal/40 opacity-0 transition-opacity duration-500 ease-cinematic group-hover:opacity-100">
              <Instagram size={26} strokeWidth={1.5} className="text-canvas" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
