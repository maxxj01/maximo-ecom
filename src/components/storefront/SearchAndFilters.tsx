"use client";

import { LayoutGrid, List, Search } from "lucide-react";

export function SearchAndFilters({
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar por título, categoria ou código"
            className="w-full rounded-full border border-border bg-bg py-2.5 pl-9 pr-4 text-sm text-text outline-none focus:border-purple"
          />
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-full border border-border p-1">
          <button
            type="button"
            aria-label="Ver em grade"
            aria-pressed={viewMode === "grid"}
            onClick={() => onViewModeChange("grid")}
            className={`rounded-full p-2 ${viewMode === "grid" ? "bg-purple text-white" : "text-text-muted hover:bg-lilac-light/60"}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            aria-label="Ver em lista"
            aria-pressed={viewMode === "list"}
            onClick={() => onViewModeChange("list")}
            className={`rounded-full p-2 ${viewMode === "list" ? "bg-purple text-white" : "text-text-muted hover:bg-lilac-light/60"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === null
                ? "bg-purple text-white"
                : "border border-border text-text-muted hover:bg-lilac-light/60"
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === category
                  ? "bg-purple text-white"
                  : "border border-border text-text-muted hover:bg-lilac-light/60"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
