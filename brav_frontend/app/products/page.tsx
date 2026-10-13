"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProductsContent from "@/components/products/ProductsContent";

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsContent />
    </ProtectedRoute>
  );
}