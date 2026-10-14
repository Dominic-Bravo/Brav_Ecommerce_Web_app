"use client";

import { create } from "zustand";
import {
  fetchCart,
  fetchCartItems,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  updateCartItem as updateCartItemApi,
  patchCartItem as patchCartItemApi,
} from "@/lib/api/cart";
import { queryClient } from "@/components/providers/QueryClientProvider";

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
  cart: {
    id: string;
    total_price: string;
    created_at: string;
    updated_at: string;
  } | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  init: () => Promise<void>;
  loadFromBackend: () => Promise<void>;
  addItem: (productId: string, productName: string, productImageUrl: string | null, price: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  cart: null,
  isLoading: false,
  error: null,

  // Initialize: load cart from backend on mount
  init: async function () {
    try {
      set({ isLoading: true, error: null });
      await this.loadFromBackend();
    } catch (err: any) {
      set({ error: err.message || "Failed to initialize cart" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Load cart state from the backend API
  loadFromBackend: async () => {
    try {
      const cartResponse = await fetchCart();
      const itemsResponse = await fetchCartItems();

      // Transform backend CartItem format to frontend CartItem format
      const transformedItems = itemsResponse.map((backendItem: any) => ({
        id: backendItem.id,
        product_id: backendItem.product,
        quantity: backendItem.quantity ?? 1,
        price_at_purchase: parseFloat(backendItem.unit_price) || 0,
        product_name: backendItem.product_details?.name || "Unknown Product",
        product_image_url:
          backendItem.product_details?.images?.[0]?.image_url || null,
      }));

      set({
        items: transformedItems,
        cart: cartResponse
          ? {
              id: cartResponse.id,
              total_price: cartResponse.total_price,
              created_at: cartResponse.created_at,
              updated_at: cartResponse.updated_at,
            }
          : null,
      });
    } catch (err: any) {
      // If cart is not available (e.g., guest user), just keep empty items
      console.warn("Could not load cart from backend:", err.message);
      set({ items: [] });
    }
  },

  // Add item to cart (both UI and backend)
  addItem: async (productId, productName, productImageUrl, price) => {
    try {
      // Add to UI state immediately (optimistic update)
      const { items } = get();
      const existingIndex = items.findIndex((item) => item.product_id === productId);

      if (existingIndex >= 0) {
        const updatedItems = [...items];
        updatedItems[existingIndex].quantity += 1;
        set({ items: updatedItems });
      } else {
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

      // Sync with backend
      await addToCartApi({
        product_id: productId,
        quantity: 1,
      });

      // Invalidate query cache to reflect backend state
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "items"] });
    } catch (err: any) {
      // If backend fails, roll back UI state
      set({
        items: get().items.filter((item) => item.product_id !== productId),
      });
      throw err;
    }
  },

  // Remove item from cart (both UI and backend)
  removeItem: async (productId) => {
    try {
      // Remove from UI state immediately
      const { items } = get();
      set({ items: items.filter((item) => item.product_id !== productId) });

      // Sync with backend
      await removeFromCartApi(productId);

      // Invalidate query cache to reflect backend state
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "items"] });
    } catch (err: any) {
      // If backend fails, roll back UI state
      const { items } = get();
      set({ items });
      throw err;
    }
  },

  // Update quantity (both UI and backend)
  updateQuantity: async (productId, quantity) => {
    try {
      // Update UI state immediately
      const { items } = get();
      const updatedItems = items.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      );
      set({ items: updatedItems });

      // Sync with backend
      await updateCartItemApi(productId, { quantity });

      // Invalidate query cache to reflect backend state
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "items"] });
    } catch (err: any) {
      // If backend fails, roll back UI state
      const { items } = get();
      set({ items: items.map((item) => (item.product_id === productId ? { ...item, quantity } : item)) });
      throw err;
    }
  },

  // Clear cart (both UI and backend)
  clearCart: async () => {
    try {
      set({ items: [] });
      // Remove all items from backend
      const { items } = get();
      for (const item of items) {
        await removeFromCartApi(item.product_id);
      }
      // Invalidate query cache
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "items"] });
    } catch (err: any) {
      // Reset items on error; backend state is authoritative
      set({ items: [] });
      throw err;
    }
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