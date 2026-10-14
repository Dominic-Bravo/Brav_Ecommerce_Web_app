"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import type { CartItem as StoreCartItem } from "@/store/useCartStore";

interface CartItemProps {
  item: StoreCartItem;
  onUpdateQuantity: (cartItemId: string, newQuantity: number, currentQuantity: number) => void;
  onRemove: (cartItemId: string) => void;
  isUpdating?: boolean;
  isOutOfStock?: boolean;
}

/**
 * Single cart item row — shows product image, name, price,
 * quantity control with increment/decrement, line subtotal, and remove.
 */
export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
  isOutOfStock = false,
}: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const { user } = useAuth();

  const isAvailable = !isOutOfStock && item.quantity > 0;

  const quantityControlClasses = cn(
    "flex items-center gap-2",
    isOutOfStock
      ? "text-red-400"
      : isAvailable
      ? ""
      : "text-brav-muted",
  );

  const inputClasses = cn(
    "w-16 text-center py-1.5 text-sm rounded-brav-md border border-brav-border text-brav-text",
    isOutOfStock || isUpdating
      ? "bg-brav-secondary text-white cursor-not-allowed"
      : "",
  );

  const formatMoney = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(num);
  };

  const handleIncrement = async () => {
    setQuantity((prev) => prev + 1);
    await onUpdateQuantity(item.id, quantity + 1, quantity);
  };

  const handleDecrement = async () => {
    if (quantity <= 1) {
      onRemove(item.id);
      setQuantity(1);
      return;
    }
    setQuantity((prev) => prev - 1);
    await onUpdateQuantity(item.id, quantity - 1, quantity);
  };

  const handleManualChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    const parsed = Math.max(1, Math.round(value));
    if (parsed !== quantity) {
      setQuantity(parsed);
      await onUpdateQuantity(item.id, parsed, quantity);
    }
  };

  return (
    <div className="rounded-brav-lg border border-brav-border bg-white overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-square bg-brav-secondary">
        {item.product_image_url ? (
          <Image
            src={item.product_image_url}
            alt={item.product_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-brav-muted">No image</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-brav-heading line-clamp-2">{item.product_name}</h3>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-brav-text font-medium">
              {formatMoney(item.price_at_purchase)}
            </span>

            <div className={quantityControlClasses}>
              <Button
                size="sm"
                onClick={handleDecrement}
                disabled={quantity <= 1 || isOutOfStock || isUpdating}
                className="flex-1"
              >
                {"-"}
              </Button>

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={handleManualChange}
                readOnly={isOutOfStock || isUpdating}
                className={inputClasses}
                autoComplete="off"
              />

              <Button
                size="sm"
                onClick={handleIncrement}
                disabled={isOutOfStock || isUpdating}
                className="flex-1"
              >
                {"+"}
              </Button>
            </div>
          </div>

          <span className="text-brav-text font-medium">
            {formatMoney(item.price_at_purchase * item.quantity)}
          </span>

          {user && !isUpdating && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                onRemove(item.id);
              }}
              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}