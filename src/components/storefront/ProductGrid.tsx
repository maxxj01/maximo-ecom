import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export function ProductGrid({
  products,
  onQuickOrder,
}: {
  products: Product[];
  onQuickOrder: (product: Product) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1280px]:grid-cols-4">
      {products.map((product, index) => (
        <Reveal key={product.id} delayMs={(index % 4) * 60}>
          <ProductCard product={product} layout="grid" onQuickOrder={onQuickOrder} />
        </Reveal>
      ))}
    </div>
  );
}
