"use client";

import { useRouter } from "next/navigation";
import { useAddToCart } from "@/lib/api/cart";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/api/generated/model";

import PublicProductsContent from "@/components/products/PublicProductsContent";

/**
 * Public product listing page.
 *
 * Per CLAUDE.md rules, this page must be accessible to both
 * authenticated and unauthenticated visitors. No authentication
 * is required to browse the product catalog.
 */
export default function ProductsPage() {
  const router = useRouter();
  const { mutate: addToCart } = useAddToCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      // Redirect to login with return path to return to product after login
      router.push(`/login?redirect=/products`);
      return;
    }

    addToCart({ product_id: product.id, quantity: 1 });
    router.push("/cart");
  };

  return <PublicProductsContent onAddToCart={handleAddToCart} />;
}