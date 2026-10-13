"use client";

import type { Category } from "@/api/generated/model";

interface ProductHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categories: Category[];
  isLoading: boolean;
}

export default function ProductHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  isLoading,
}: ProductHeaderProps) {
  return (
    <header className="mb-12">
      <h1 className="text-3xl font-bold text-brav-heading">
        Products
      </h1>

      {/* Search bar */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brav-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm rounded-brav-md border border-brav-border bg-white text-brav-text focus:outline-none focus:ring-2 focus:ring-brav-primary"
            autoComplete="off"
            disabled={isLoading}
          />
        </div>

        {/* Category filter - desktop */}
        <div className="hidden sm:block">
          <select
            onChange={(e) => onCategoryChange(e.target.value === "all" ? null : e.target.value)}
            className="py-2 px-4 rounded-brav-lg border border-brav-border text-brav-text"
            disabled={isLoading}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category filter - mobile */}
      {categories.length > 0 && !isLoading && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(selectedCategory === cat.id ? null : cat.id)}
              className={`rounded-brav-md border border-brav-border px-3 py-1.5 text-sm ${
                selectedCategory === cat.id
                  ? "bg-brav-primary text-white"
                  : "text-brav-muted hover:bg-brav-secondary hover:text-brav-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}