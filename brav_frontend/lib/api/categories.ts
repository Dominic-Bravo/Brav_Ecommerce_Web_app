/**
 * Categories API layer.
 *
 * Wraps the auto-generated Orval endpoint: getCategories.
 * Includes a configured axios instance for auth support.
 */
import axios from "axios";
import { authManager } from "@/lib/auth/AuthManager";

import { getCategories } from "@/api/generated/categories/categories";

import type { Category, CategoryRequest, PatchedCategoryRequest } from "@/api/generated/model";

// ─── Configured axios instance ────────────────────────────────────────────────

/**
 * The Orval-generated code uses URL paths like `/api/v1/...`,
 * while NEXT_PUBLIC_API_URL includes the trailing `/api`.
 * Strip it so the baseURL + endpoint don't double up.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const baseURL = API_URL.replace(/\/api$/, "");

export const axiosInstance = axios.create({
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

// ─── Categories CRUD ───────────────────────────────────────────────────────────

/**
 * Fetch all categories from the backend.
 *
 * Returns the Orval-generated query function so
 * callers can use it with TanStack React Query.
 */
export async function getAllCategories(): Promise<Category[]> {
  const categories = await getCategories(axiosInstance);
  const response = await categories.v1ProductsCategoriesList();
  return response.data;
}

/**
 * Convenience wrapper that resolves the AxiosResponse
 * and returns just the category data array.
 */
export async function getCategoriesData(): Promise<Category[]> {
  const categories = await getCategories(axiosInstance);
  const response = await categories.v1ProductsCategoriesList();
  return response.data;
}

/**
 * Fetch category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  const categories = await getCategories(axiosInstance);
  const response = await categories.v1ProductsCategoriesRetrieve(slug);
  return response.data;
}

/**
 * Create a new category.
 */
export async function createCategory(data: CategoryRequest): Promise<Category> {
  const categories = await getCategories(axiosInstance);
  const response = await categories.v1ProductsCategoriesCreate(data);
  return response.data;
}

/**
 * Update a category (full replace).
 */
export async function updateCategory(slug: string, data: CategoryRequest): Promise<Category> {
  const categories = await getCategories(axiosInstance);
  const response = await categories.v1ProductsCategoriesUpdate(slug, data);
  return response.data;
}

/**
 * Partially update a category.
 */
export async function patchCategory(slug: string, data: PatchedCategoryRequest): Promise<Category> {
  const categories = await getCategories(axiosInstance);
  const response = await categories.v1ProductsCategoriesPartialUpdate(slug, data);
  return response.data;
}

/**
 * Delete a category.
 */
export async function deleteCategory(slug: string): Promise<void> {
  const categories = await getCategories(axiosInstance);
  await categories.v1ProductsCategoriesDestroy(slug);
}

// ─── React Query Custom Hooks ────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";

/**
 * Hook for fetching all categories
 * Returns the array of categories directly from the API response.
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const categories = await getCategoriesData();
      return categories;
    },
  });
}

/**
 * Hook for fetching category by slug
 */
export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const category = await getCategoryBySlug(slug);
      return category;
    },
    enabled: !!slug,
  });
}

// ─── React Query Mutation Hooks ────────────────────────────────────────────────────

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for creating a category.
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

/**
 * Hook for updating a category.
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: CategoryRequest }) =>
      updateCategory(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

/**
 * Hook for patching a category.
 */
export function usePatchCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: PatchedCategoryRequest }) =>
      patchCategory(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

/**
 * Hook for deleting a category.
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}