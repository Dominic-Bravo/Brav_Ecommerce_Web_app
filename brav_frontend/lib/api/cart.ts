/**
 * Cart API layer.
 *
 * Uses the auto-generated Orval endpoints from api/generated/cart/ to call the backend.
 * A configured axios instance (with credentials and auth headers) is passed to the Orval hooks so auth works correctly.
 */
import axios from "axios";
import { authManager } from "@/lib/auth/AuthManager";
import { queryClient } from "@/components/providers/QueryClientProvider";
import useCartStore from "@/store/useCartStore";

import { getCart } from "@/api/generated/cart/cart";

import type {
  Cart,
  CartItem,
  AddCartItemRequest,
  UpdateCartItemRequest,
  PatchedUpdateCartItemRequest,
} from "@/api/generated/model";

// ─── Configured axios instance ────────────────────────────────────────────────

/**
 * The Orval-generated code uses URL paths like `/api/v1/...`,
 * while NEXT_PUBLIC_API_URL includes the trailing `/api`.
 * Strip it so the baseURL + endpoint don't double up.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const baseURL = API_URL.replace(/\/api$/, "");

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

// Send HttpOnly refresh cookie with every request.
axiosInstance.defaults.withCredentials = true;

// Attach the access token (stored in memory by AuthManager).
axiosInstance.interceptors.request.use((config) => {
  const accessToken = authManager.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// ─── Raw Async Functions ───────────────────────────────────────────────────────

/**
 * Fetch the user's cart from the backend.
 *
 * Returns the full cart object with items, total_price, etc.
 */
export async function fetchCart(): Promise<Cart> {
  const cartModule = getCart(axiosInstance);
  const response = await cartModule.v1CartRetrieve();
  return response.data;
}

/**
 * Fetch all cart items for the current user.
 *
 * Returns just the array of cart items (instead of the full cart object).
 */
export async function fetchCartItems(): Promise<CartItem[]> {
  const cartModule = getCart(axiosInstance);
  const response = await cartModule.v1CartItemsList();
  return response.data;
}

/**
 * Add an item to the cart.
 */
export async function addToCart(
  data: AddCartItemRequest,
): Promise<CartItem> {
  const cartModule = getCart(axiosInstance);
  const response = await cartModule.v1CartItemsCreate(data);
  return response.data;
}

/**
 * Update a cart item (full replace).
 */
export async function updateCartItem(
  cartItemId: string,
  data: UpdateCartItemRequest,
): Promise<CartItem> {
  const cartModule = getCart(axiosInstance);
  const response = await cartModule.v1CartItemsUpdate(cartItemId, data);
  return response.data;
}

/**
 * Partially update a cart item (e.g., just quantity).
 */
export async function patchCartItem(
  cartItemId: string,
  data?: PatchedUpdateCartItemRequest,
): Promise<CartItem> {
  const cartModule = getCart(axiosInstance);
  const response = await cartModule.v1CartItemsPartialUpdate(cartItemId, data);
  return response.data;
}

/**
 * Remove an item from the cart.
 */
export async function removeFromCart(cartItemId: string): Promise<void> {
  const cartModule = getCart(axiosInstance);
  await cartModule.v1CartItemsDestroy(cartItemId);
}

// ─── React Query Hooks ─────────────────────────────────────────────────────────

import { useQuery, useMutation } from "@tanstack/react-query";

/**
 * Hook for fetching the user's cart.
 *
 * Returns the full cart object with items, total_price, etc.
 */
export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => fetchCart(),
  });
}

/**
 * Hook for fetching just the cart items array.
 *
 * Useful when you only need the items without the full cart object.
 */
export function useCartItems() {
  return useQuery({
    queryKey: ["cart", "items"],
    queryFn: () => fetchCartItems(),
  });
}

/**
 * Hook for adding an item to the cart.
 *
 * Invalidates both cart and cart-items queries on success
 * and refreshes the local Zustand cart store.
 */
export function useAddToCart() {
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "items"] });
      // Refresh the local Zustand cart store so the UI badge and cart page update
      const { loadFromBackend } = useCartStore.getState();
      loadFromBackend();
    },
  });
}

/**
 * Hook for updating a cart item quantity.
 */
export function useUpdateCartItem() {
  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
      updateCartItem(cartItemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "items"] });
    },
  });
}

/**
 * Hook for partially updating a cart item (e.g., adjusting quantity by specific amount).
 */
export function usePatchCartItem() {
  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity?: number }) =>
      patchCartItem(cartItemId, quantity !== undefined ? { quantity } : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "items"] });
    },
  });
}

/**
 * Hook for removing an item from the cart.
 */
export function useRemoveFromCart() {
  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "items"] });
    },
  });
}