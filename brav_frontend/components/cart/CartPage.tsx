"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/lib/api/cart";
import useCartStore from "@/store/useCartStore";
import { cn } from "@/lib/utils";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

import Button from "@/components/ui/Button";
import Image from "next/image";

const CURRENCY_CODE = "PHP";

/**
 * Main shopping cart content.
 *
 * - Cart data comes from the backend `useCart` query (source of truth).
 * - Local mutation state is managed via the Zustand store for responsive UI.
 * - Renders empty/error/loading states as appropriate.
 */
export default function CartPage() {
  const router = useRouter();

  const { data: cart, isLoading, error, refetch } = useCart();
  const { items: storeItems } = useCartStore();

  const { mutate: updateQuantity, isPending: updating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: removing } = useRemoveFromCart();

  const isLoadingCart = isLoading;
  const errorCart = error;
  // Use Zustand store items (transformed format with price_at_purchase)
  const cartItems = storeItems;
  const cartTotal = cart?.total_price ?? "0.00";

  /**
   * Update the quantity for a cart item.
   * Uses optimistic UI update through the Zustand store.
   */
  const handleQuantityChange = (
    cartItemId: string,
    newQuantity: number,
    currentQuantity: number
  ) => {
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    if (newQuantity === currentQuantity) {
      return;
    }

    // Optimistic UI update
    useCartStore.getState().updateQuantity(cartItemId, newQuantity);
    updateQuantity({ cartItemId, quantity: newQuantity });
  };

  /**
   * Remove a cart item.
   * Uses optimistic UI update through the Zustand store.
   */
  const handleRemoveItem = (cartItemId: string) => {
    useCartStore.getState().removeItem(cartItemId);
    removeItem(cartItemId);
  };

  const handleContinueShopping = () => {
    router.push("/products");
  };

  /**
   * Format a money string for display.
   */
  const formatMoney = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: CURRENCY_CODE,
    }).format(num);
  };

  if (isLoadingCart) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center bg-brav-background py-12">
        <p className="text-brav-muted">Loading cart...</p>
      </section>
    );
  }

  if (errorCart) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center bg-brav-background py-12">
        <div className="space-y-4 text-center">
          <p className="text-brav-error">
            Error loading cart: {(errorCart as Error).message}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={handleContinueShopping}>Continue Shopping</Button>
            <Button onClick={() => refetch()} variant="secondary">
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center bg-brav-background py-12">
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-bold text-brav-heading">
            Your cart is empty
          </h2>
          <p className="text-brav-muted">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Button onClick={handleContinueShopping}>Continue Shopping</Button>
        </div>
      </section>
    );
  }

  // Calculate total item count from backend data
  const totalItemQty = cartItems.reduce(
    (count, item) => count + (item.quantity ?? 0),
    0
  );

  return (
    <section className="bg-brav-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brav-heading">Shopping Cart</h1>
          <p className="mt-1 text-sm text-brav-muted">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} ·{" "}
            {formatMoney(cartTotal)} total
          </p>
        </div>

        <div className="space-y-6">
          {/* Cart items */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              // Check availability from backend query data (source of truth for stock)
              const backendItem = cart?.items?.find((bi) => bi.id === item.id);
              const productDetails = backendItem?.product_details;
              const isAvailable = productDetails?.stock_quantity
                ? productDetails.stock_quantity > 0
                : true;
              const isOutOfStock = !isAvailable;

              return (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  isUpdating={updating || removing}
                  isOutOfStock={isOutOfStock}
                />
              );
            })}
          </div>

          {/* Cart summary */}
          <div className="border-t border-brav-border pt-6">
            <CartSummary
              totalItemQty={totalItemQty}
              cartTotal={cartTotal}
              formattedCartTotal={formatMoney(cartTotal)}
              onCheckout={() => router.push("/checkout")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
