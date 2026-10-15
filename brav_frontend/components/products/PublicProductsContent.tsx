"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "@/lib/api/products";
import { useCategories } from "@/lib/api/categories";
import type { Product } from "@/api/generated/model";

import Button from "@/components/ui/Button";
import ProductHeader from "./ProductHeader";
import ProductsGrid from "./ProductsGrid";

export interface PublicProductsContentProps {
  onAddToCart?: (product: Product) => void;
}

export default function PublicProductsContent({ onAddToCart }: PublicProductsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const router = useRouter();

  // Use the existing useProducts hook from lib/api/products.ts
  const { data: allProducts, isLoading, error, refetch } = useProducts();

  // Fetch categories using the existing hook
  const { data: categories } = useCategories();

  // Filter products based on search and category
  const filteredProducts = allProducts?.filter((product: Product) => {
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }) ?? [];

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-brav-muted">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-brav-error">Error loading products: {(error as Error).message}</p>
        <Button onClick={() => router.refresh()}>Retry</Button>
      </div>
    );
  }

  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <section className="py-12 bg-brav-background">
      <div className="max-w-7xl mx-auto px-6">
        <ProductHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories ?? []}
          isLoading={isLoading}
        />

        <ProductsGrid
          products={filteredProducts}
          isLoading={isLoading}
          onAddToCart={handleAddToCart}
          isAdmin={false}
        />

        {filteredProducts.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-12">
            <p className="text-brav-muted">
              No products match your search. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}