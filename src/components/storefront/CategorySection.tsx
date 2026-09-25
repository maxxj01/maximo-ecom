import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export function CategorySection({
  category,
  products,
  onQuickOrder,
  onViewAll,
}: {
  category: string;
  products: Product[];
  onQuickOrder: (product: Product) => void;
  onViewAll: (category: string) => void;
}) {
  return (
    <section className="py-6">
      <Reveal>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-xl font-extrabold text-text">
            <span className="h-6 w-1 shrink-0 rounded-full bg-purple" />
            {category}
          </h2>
          <button
            type="button"
            onClick={() => onViewAll(category)}
            className="text-sm font-semibold text-purple hover:opacity-80"
          >
            Ver tudo →
          </button>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1280px]:grid-cols-4">
        {products.map((product, index) => (
          <Reveal key={product.id} delayMs={(index % 4) * 60}>
            <ProductCard product={product} layout="grid" onQuickOrder={onQuickOrder} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
