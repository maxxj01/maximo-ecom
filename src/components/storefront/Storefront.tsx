"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { SearchAndFilters } from "./SearchAndFilters";
import { ProductGrid } from "./ProductGrid";
import { ProductList } from "./ProductList";
import { OrderModal } from "./OrderModal";

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

  return (
    <section id="produtos" className="mx-auto max-w-6xl px-4 py-10 min-[900px]:px-6">
      <SearchAndFilters
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="mt-6">
        {filteredProducts.length === 0 ? (
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
