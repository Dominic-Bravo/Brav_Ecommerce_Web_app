import axios from "axios";
import { authManager } from "@/lib/auth/AuthManager";

import { getOrders } from "@/api/generated/orders/orders";
import { getAddresses } from "@/api/generated/addresses/addresses";

import type { CheckoutRequest, Order } from "@/api/generated/model";
import type { Address } from "@/types/address";

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

/**
 * Fetch all addresses for the current user.
 *
 * Maps Orval-generated Address to local types.Address (normalizes type field).
 * The backend returns a wrapped envelope `{ data: [...] }`, so we unwrap it.
 */
export async function getAddressesApi(): Promise<Address[]> {
  try {
    const addressesModule = getAddresses(axiosInstance);
    const response = await addressesModule.v1UsersAddressesList();

    // Backend returns a wrapped envelope: { data: Address[] }
    const envelope = response.data as {
      data?: Address[];
    };
    const rawAddresses = Array.isArray(envelope.data)
      ? envelope.data
      : [];

    // Map Orval Address → local types.Address (type is optional in Orval, required locally)
    return rawAddresses.map((addr) => ({
      id: addr.id,
      type: addr.type ?? "shipping",
      full_name: addr.full_name,
      phone: addr.phone,
      street_address: addr.street_address,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country,
      is_default: addr.is_default ?? false,
      created_at: addr.created_at,
      updated_at: addr.updated_at,
    }));
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch addresses."
    );
  }
}

/**
 * Submit the current cart as an order.
 *
 * This is the checkout endpoint: it converts cart items into a permanent
 * order, deducts stock, snapshots the shipping address, and clears the cart.
 */
export async function submitCheckoutApi(
  data: CheckoutRequest
): Promise<Order> {
  try {
    // Use Orval-generated endpoint (properly handles /api prefix)
    const ordersModule = getOrders(axiosInstance);
    const response = await ordersModule.v1OrdersCheckoutCreate(data);
    // Backend wraps responses in { data: ... }
    const envelope = response.data as { data?: Order };
    return envelope.data ?? (envelope as unknown as Order);
  } catch (error) {
    // Handle field-level errors (e.g. non_field_errors, stock issues)
    // Backend wraps error responses in { data: { ...errors...} }
    const err = error as {
      response?: {
        data?: {
          data?: Record<string, unknown>;
          detail?: string;
          message?: string;
        };
      };
    };
    const errorData = err.response?.data?.data ?? err.response?.data;

    if (errorData && typeof errorData === "object") {
      const fieldErrors = Object.entries(errorData).filter(
        ([, value]) =>
          Array.isArray(value) && value.length > 0
      );

      if (fieldErrors.length > 0) {
        // Field-level errors (e.g. non_field_errors, stock issues)
        const messages = fieldErrors
          .map(([key, values]) => {
            if (typeof values === "string") {
              return [values];
            }
            if (Array.isArray(values)) {
              return values.map((v) =>
                key === "non_field_errors"
                  ? String(v)
                  : `${key}: ${String(v)}`
              );
            }
            return [String(values)];
          })
          .flat()
          .join(" ");

        throw new Error(messages);
      }

      throw new Error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Checkout failed. Please try again."
      );
    }

    throw new Error(
      error instanceof Error
        ? error.message
        : "Checkout failed. Please try again."
    );
  }
}

// ─── React Query Hooks ───────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";

/**
 * Hook for fetching the user's orders.
 *
 * Customers see only their own orders. Admins see all store orders.
 */
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const ordersModule = getOrders(axiosInstance);
      const response = await ordersModule.v1OrdersList();
      return response.data;
    },
  });
}

/**
 * Hook for fetching a single order by ID.
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const ordersModule = getOrders(axiosInstance);
      const response = await ordersModule.v1OrdersRetrieve(id);
      return response.data;
    },
    enabled: !!id,
  });
}
