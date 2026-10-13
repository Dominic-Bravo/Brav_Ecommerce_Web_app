"use client";

import { create } from "zustand";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product_name: string;
  product_image_url: string | null;
}

export interface CartState {
  items: CartItem[];
  addItem: (productId: string, productName: string, productImageUrl: string | null, price: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (productId, productName, productImageUrl, price) => {
    const { items } = get();

    // Check if item already exists in cart
    const existingIndex = items.findIndex((item) => item.product_id === productId);

    if (existingIndex >= 0) {
      // Update quantity if item exists
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += 1;
      set({ items: updatedItems });
    } else {
      // Add new item
      set({
        items: [
          ...items,
          {
            id: crypto.randomUUID(),
            product_id: productId,
            quantity: 1,
            price_at_purchase: price,
            product_name: productName,
            product_image_url: productImageUrl,
          },
        ],
      });
    }
  },

  removeItem: (productId) => {
    const { items } = get();
    const filteredItems = items.filter((item) => item.product_id !== productId);
    set({ items: filteredItems });
  },

  updateQuantity: (productId, quantity) => {
    const { items } = get();
    const updatedItems = items.map((item) =>
      item.product_id === productId ? { ...item, quantity } : item
    );
    set({ items: updatedItems });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalQuantity: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce(
      (total, item) => total + item.price_at_purchase * item.quantity,
      0
    );
  },
}));

export default useCartStore;