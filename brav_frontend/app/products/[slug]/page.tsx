"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { authManager } from "@/lib/auth/AuthManager";

import ProductDetailsContent from "@/components/products/ProductDetailsContent";
import { getProducts } from "@/api/generated/products/products";

/**
 * Public product details page.
 *
 * Per CLAUDE.md rules, this page must be accessible to both
 * authenticated and unauthenticated visitors. No authentication
 * is required to view product details.
 *
 * The Add to Cart action will handle authentication requirements.
 */
export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Configure axios instance for auth (per existing pattern in ProductsContent.tsx)
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, ""),
    headers: {
      Accept: "application/json",
    },
  });
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.interceptors.request.use((config) => {
    const accessToken = authManager.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const productsApi = await getProducts(axiosInstance);
      const response = await productsApi.v1ProductsProductsRetrieve(slug);
      return response.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-brav-muted">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center">
        <p className="text-brav-error">Product not found</p>
      </div>
    );
  }

  return <ProductDetailsContent product={product} />;
}