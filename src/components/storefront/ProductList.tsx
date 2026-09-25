import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export function ProductList({
  products,
  onQuickOrder,
}: {
  products: Product[];
  onQuickOrder: (product: Product) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {products.map((product, index) => (
        <Reveal key={product.id} delayMs={Math.min(index, 6) * 50}>
          <ProductCard product={product} layout="list" onQuickOrder={onQuickOrder} />
        </Reveal>
      ))}
    </div>
  );
}
