"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import useCartStore from "@/store/useCartStore";

import Button from "@/components/ui/Button";

interface CartSummaryProps {
  totalItemQty: number;
  cartTotal: string;
  formattedCartTotal: string;
  onCheckout: () => void;
}

/**
 * Cart summary — shows item count, subtotal, checkout button.
 *
 * For guests (unauthenticated), shows a message prompting login to checkout.
 * For authenticated users, shows the checkout button.
 */
export default function CartSummary({
  totalItemQty,
  cartTotal,
  formattedCartTotal,
  onCheckout,
}: CartSummaryProps) {
  const { isAuthenticated } = useAuth();
  const { items: localItems } = useCartStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
      {/* Summary */}
      <div className="space-y-2">
        <p className="text-sm text-brav-muted">
          {totalItemQty} item{totalItemQty !== 1 ? "s" : ""}
        </p>
        <p className="text-2xl font-bold text-brav-heading">
          {formattedCartTotal}
        </p>
      </div>

      {/* Checkout button */}
      <div className="flex items-center justify-end lg:justify-start">
        {isAuthenticated ? (
          <>
            <Button
              onClick={onCheckout}
              className="w-full lg:w-auto px-6 py-3"
            >
              Proceed to checkout
            </Button>
          </>
        ) : (
          <div className="w-full lg:w-auto space-y-2">
            <p className="text-sm text-brav-muted">
              Please log in to proceed to checkout.
            </p>
            <Button onClick={() => window.location.href = "/login"} variant="secondary">
              Sign in
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}