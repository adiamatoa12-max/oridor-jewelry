import VariantCard, { type VariantProduct } from "./VariantCard";

/**
 * Grid of the Signature collection — each card carries interactive color
 * swatches that swap the image between metal finishes.
 */
export default function SignatureGrid({ products }: { products: VariantProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
      {products.map((p) => (
        <VariantCard key={p.id} product={p} />
      ))}
    </div>
  );
}
