"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { SearchAndFilters } from "./SearchAndFilters";
import { ProductGrid } from "./ProductGrid";
import { ProductList } from "./ProductList";
import { CategorySection } from "./CategorySection";
import { OrderModal } from "./OrderModal";
import { Reveal } from "@/components/ui/Reveal";

export function Storefront({ initialProducts }: { initialProducts: Product[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);

  const visibleProducts = useMemo(
    () => initialProducts.filter((p) => p.visible),
    [initialProducts]
  );

  const categories = useMemo(
    () => Array.from(new Set(visibleProducts.map((p) => p.category))).sort(),
    [visibleProducts]
  );

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visibleProducts.filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
      );
    });
  }, [visibleProducts, query, activeCategory]);

  const productsByCategory = useMemo(() => {
    return categories.map((category) => ({
      category,
      products: visibleProducts.filter((p) => p.category === category),
    }));
  }, [categories, visibleProducts]);

  const isBrowsingAll = !query.trim() && !activeCategory;

  return (
    <section id="produtos" className="mx-auto max-w-6xl px-4 py-10 min-[900px]:px-6">
      <Reveal>
        <SearchAndFilters
          query={query}
          onQueryChange={setQuery}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </Reveal>

      <div className="mt-6">
        {isBrowsingAll ? (
          productsByCategory.map(({ category, products }) => (
            <CategorySection
              key={category}
              category={category}
              products={products}
              onQuickOrder={setQuickOrderProduct}
              onViewAll={setActiveCategory}
            />
          ))
        ) : filteredProducts.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">
            Nenhum produto encontrado.
          </p>
        ) : viewMode === "grid" ? (
          <ProductGrid products={filteredProducts} onQuickOrder={setQuickOrderProduct} />
        ) : (
          <ProductList products={filteredProducts} onQuickOrder={setQuickOrderProduct} />
        )}
      </div>

      {quickOrderProduct && (
        <OrderModal
          mode="quick"
          product={quickOrderProduct}
          onClose={() => setQuickOrderProduct(null)}
        />
      )}
    </section>
  );
}
