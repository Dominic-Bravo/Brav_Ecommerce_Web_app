"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import Button from "@/components/ui/Button";
import type { Product } from "@/api/generated/model";

interface ProductDetailsContentProps {
  product: Product;
}

export default function ProductDetailsContent({ product }: ProductDetailsContentProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numPrice);
  };

  const handleAddToCart = async () => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }

    setError(null);
    setIsAdding(true);

    try {
      // Use the Cart API layer to update both API and Zustand store
      const { addToCart } = await import("@/lib/api/cart");

      // Add item to cart (auto-invalidates queries and updates Zustand)
      await addToCart({
        product_id: product.id,
        quantity,
      });

      // Success! The cart store will be auto-refreshed via query invalidation
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock_quantity !== undefined && product.stock_quantity <= 0;

  return (
    <section className="py-12 bg-brav-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Column */}
          <div className="rounded-brav-lg border border-brav-border bg-white overflow-hidden">
            {product.image_url ? (
              <div className="relative aspect-square bg-brav-secondary">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-full aspect-square items-center justify-center bg-brav-secondary">
                <span className="text-brav-muted">No image</span>
              </div>
            )}

            {product.status && (
              <div className="absolute top-4 right-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    product.status === "active"
                      ? "bg-brav-primary text-white"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            )}
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-brav-heading mb-2">
              {product.name}
            </h1>

            {product.category_name && (
              <p className="text-brav-muted text-sm mb-4">
                Category: {product.category_name}
              </p>
            )}

            <div className="mb-6">
              <span className="text-4xl font-bold text-brav-text">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-brav-heading mb-2">
                Description
              </h2>
              <p className="text-brav-text leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-brav-muted">SKU</span>
                <span className="font-medium text-brav-text">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brav-muted">Availability</span>
                <span
                  className={`font-medium ${
                    isOutOfStock
                      ? "text-brav-error"
                      : "text-brav-success"
                  }`}
                >
                  {isOutOfStock
                    ? "Out of stock"
                    : product.stock_quantity !== undefined
                    ? `${product.stock_quantity} in stock`
                    : "Available"}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-brav-md bg-brav-danger-bg border border-brav-danger">
                <p className="text-brav-error text-sm">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="quantity"
                  className="text-sm font-medium text-brav-text"
                >
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock_quantity ?? 999}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 rounded-brav-md border border-brav-border px-3 py-2 text-center"
                />
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={isAdding || isOutOfStock}
                className="flex-1"
              >
                {isAdding
                  ? "Adding..."
                  : isOutOfStock
                    ? "Out of stock"
                    : "Add to cart"}
              </Button>
            </div>

            {!isAuthenticated && (
              <p className="mt-4 text-sm text-brav-muted">
                You must{" "}
                <button
                  onClick={() =>
                    router.push(`/login?redirect=/products/${product.slug}`)
                  }
                  className="text-brav-accent hover:underline"
                >
                  log in
                </button>{" "}
                or{" "}
                <button
                  onClick={() =>
                    router.push(`/signup?redirect=/products/${product.slug}`)
                  }
                  className="text-brav-accent hover:underline"
                >
                  sign up
                </button>{" "}
                to add items to your cart.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}