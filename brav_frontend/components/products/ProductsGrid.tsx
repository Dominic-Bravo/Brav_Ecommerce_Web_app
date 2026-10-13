"use client";

import type { Product } from "@/api/generated/model";
import ProductCard from "./ProductCard";

interface ProductsGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart?: (product: Product) => void;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductsGrid({
  products,
  isLoading,
  onAddToCart,
  isAdmin,
  onEdit,
  onDelete,
}: ProductsGridProps) {
  if (isLoading) {
    return (
      <p className="col-span-full text-center text-brav-muted">
        Loading products...
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="col-span-full text-center text-brav-muted">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id || product.slug}
          product={product}
          onAddToCart={onAddToCart}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}