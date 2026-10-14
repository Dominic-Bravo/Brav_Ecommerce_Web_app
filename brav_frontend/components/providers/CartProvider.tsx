"use client";

import { useEffect } from "react";
import useCartStore from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const initCart = useCartStore((state) => state.init);

  // Initialize cart on mount and when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      initCart();
    }
  }, [isAuthenticated, initCart]);

  return <>{children}</>;
}