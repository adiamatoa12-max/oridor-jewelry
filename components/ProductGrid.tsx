import ProductCard, { type ProductCardProps } from "./ProductCard";

interface ProductGridProps {
  eyebrow?: string;
  heading?: string;
  products: ProductCardProps[];
}

/**
 * Editorial product grid.
 * Wide breathing room: generous section padding and large gaps between cards,
 * letting each piece sit on its own. Reusable across Home and Shop.
 */
export default function ProductGrid({ eyebrow, heading, products }: ProductGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      {(eyebrow || heading) && (
        <div className="mb-16 text-center lg:mb-20">
          {eyebrow && (
            <p className="mb-3 text-xs uppercase tracking-brand text-ash">{eyebrow}</p>
          )}
          {heading && (
            <h2 className="text-3xl font-light tracking-wide text-charcoal">{heading}</h2>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-20">
        {products.map((p) => (
          <ProductCard key={p.title} {...p} />
        ))}
      </div>
    </section>
  );
}
