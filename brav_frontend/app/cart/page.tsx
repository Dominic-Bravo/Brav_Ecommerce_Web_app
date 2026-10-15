"use client";

import { useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CartPage from "@/components/cart/CartPage";
import useCartStore from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";

/**
 * Customer shopping cart page.
 *
 * Per CLAUDE.md rules, this page requires authentication.
 * The ProtectedRoute component handles the auth redirect.
 */
export default function CartPageRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Initialize cart when user is authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      useCartStore.getState().init();
    }
  }, [isAuthenticated, isLoading]);

  return (
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  );
}