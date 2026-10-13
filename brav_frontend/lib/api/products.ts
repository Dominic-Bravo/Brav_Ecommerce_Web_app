/**
 * Products API layer.
 *
 * Uses the auto-generated Orval endpoints from api/generated/products/
 * and api/generated/categories/ to call the backend.
 * A configured axios instance (with credentials and auth headers)
 * is passed to the Orval hooks so auth works correctly.
 */
import axios from "axios";
import { authManager } from "@/lib/auth/AuthManager";

import { getProducts } from "@/api/generated/products/products";
import { getCategories } from "@/api/generated/categories/categories";

import type {
  Product,
  Category,
  ProductRequest,
  PatchedProductRequest,
  CategoryRequest,
  PatchedCategoryRequest,
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

// ─── Product CRUD ──────────────────────────────────────────────────────────────

/**
 * Fetch all products from the backend.
 *
 * The Orval `getProducts()` function returns an object
 * containing `v1ProductsProductsList`. We pass our configured
 * axios instance so auth headers and credentials are included.
 */
export async function fetchProducts(): Promise<Product[]> {
  const products = await getProducts(axiosInstance);
  const response = await products.v1ProductsProductsList();
  return response.data;
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const products = await getProducts(axiosInstance);
  const response = await products.v1ProductsProductsRetrieve(slug);
  return response.data;
}

export async function createProduct(
  data: ProductRequest,
): Promise<Product> {
  const products = await getProducts(axiosInstance);
  const response = await products.v1ProductsProductsCreate(data);
  return response.data;
}

export async function updateProduct(
  slug: string,
  data: ProductRequest,
): Promise<Product> {
  const products = await getProducts(axiosInstance);
  const response = await products.v1ProductsProductsUpdate(slug, data);
  return response.data;
}

export async function patchProduct(
  slug: string,
  data: PatchedProductRequest,
): Promise<Product> {
  const products = await getProducts(axiosInstance);
  const response = await products.v1ProductsProductsPartialUpdate(
    slug,
    data,
  );
  return response.data;
}

export async function deleteProduct(slug: string): Promise<void> {
  const products = await getProducts(axiosInstance);
  await products.v1ProductsProductsDestroy(slug);
}

// ─── Category CRUD ─────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  const categories = await getCategories(axiosInstance);
  const response = await categories.v1ProductsCategoriesList();
  return response.data;
}

export async function fetchCategoryBySlug(
  slug: string,
): Promise<Category> {
  const categories = await getCategories(axiosInstance);
  const response = await categories.v1ProductsCategoriesRetrieve(slug);
  return response.data;
}

export async function createCategory(
  data: CategoryRequest,
): Promise<Category> {
  const categories = await getCategories(axiosInstance);
  const response = await categories.v1ProductsCategoriesCreate(data);
  return response.data;
}

export async function updateCategory(
  slug: string,
  data: CategoryRequest,
): Promise<Category> {
  const categories = await getCategories(axiosInstance);
  const response = await categories.v1ProductsCategoriesUpdate(slug, data);
  return response.data;
}

export async function patchCategory(
  slug: string,
  data: PatchedCategoryRequest,
): Promise<Category> {
  const categories = await getCategories(axiosInstance);
  const response = await categories.v1ProductsCategoriesPartialUpdate(
    slug,
    data,
  );
  return response.data;
}

export async function deleteCategory(slug: string): Promise<void> {
  const categories = await getCategories(axiosInstance);
  await categories.v1ProductsCategoriesDestroy(slug);
}

// ─── React Query Custom Hooks ────────────────────────────────────────────────────

import { useQuery, useMutation, type UseQueryResult } from "@tanstack/react-query";

/**
 * Hook for fetching featured products (first 4)
 */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => fetchProducts(),
  });
}

/**
 * Hook for fetching all products
 */
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });
}

/**
 * Hook for fetching product by slug
 */
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
}
