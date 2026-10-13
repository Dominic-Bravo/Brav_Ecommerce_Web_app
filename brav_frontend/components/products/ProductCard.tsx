"use client";

import Image from "next/image";
import { useState } from "react";

import Button from "@/components/ui/Button";
import type { Product } from "@/api/generated/model";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  isAdmin?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onEdit,
  onDelete,
  isAdmin = false,
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numPrice);
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      if (onAddToCart) {
        onAddToCart(product);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors = {
    active: "bg-brav-primary text-white",
    inactive: "bg-red-100 text-red-800",
  };

  return (
    <div className="rounded-brav-lg border border-brav-border bg-white overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-square bg-brav-secondary">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-brav-muted">No image</span>
          </div>
        )}
        {product.status && (
          <div className="absolute top-2 right-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[product.status] || "bg-gray-100 text-gray-800"}`}
            >
              {product.status}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-brav-heading line-clamp-2">
          {product.name}
        </h3>

        <p className="text-brav-muted text-sm line-clamp-2 mt-2">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-brav-text font-medium">
            {formatPrice(product.price)}
          </span>

          {/* Admin actions */}
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => onEdit?.(product)}
                variant="secondary"
                className="px-2 py-1 text-xs"
              >
                Edit
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => onDelete?.(product)}
                variant="secondary"
                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          )}

          {/* Customer action */}
          {onAddToCart && !isAdmin && (
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs"
            >
              {isLoading
                ? "Adding..."
                : product.stock_quantity && product.stock_quantity <= 0
                ? "Out of stock"
                : "Add to cart"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}