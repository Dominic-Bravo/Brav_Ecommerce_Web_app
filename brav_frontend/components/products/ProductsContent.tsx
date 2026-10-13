"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/lib/hooks";
import axios from "axios";
import { authManager } from "@/lib/auth/AuthManager";
import Button from "@/components/ui/Button";
import { Can } from "@/components/auth/Can";
import ProductForm from "./ProductForm";

import ProductHeader from "./ProductHeader";
import ProductsGrid from "./ProductsGrid";

import type { Product, ProductRequest } from "@/api/generated/model";
import { getProducts } from "@/api/generated/products/products";
import { getCategories } from "@/api/generated/categories/categories";

export default function ProductsContent() {
  const { isLoading: authIsLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Edit mode state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Orval requires an axios instance. Reuse the auth-configured instance
  // from AuthManager (credentials + Authorization header) so Orval
  // generated requests include the HttpOnly refresh cookie and access token.
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

  // Fetch products using Orval-generated hooks (per CLAUDE.md Rule 1)
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", debouncedSearch, selectedCategory],
    queryFn: async () => {
      const productsResponse = await getProducts(axiosInstance);
      const productsData = await productsResponse.v1ProductsProductsList();
      let filtered = productsData.data;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.slug.toLowerCase().includes(query),
        );
      }

      if (selectedCategory && selectedCategory !== "all") {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }

      return filtered;
    },
    staleTime: 5 * 60 * 1000, // Per CLAUDE.md: 5 minutes
    gcTime: 10 * 60 * 1000,   // Per CLAUDE.md: 10 minutes
    refetchOnWindowFocus: false, // Per CLAUDE.md: no refetch on focus
  });

  // Fetch categories using Orval-generated hooks (per CLAUDE.md Rule 1)
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const categoriesResponse = await getCategories(axiosInstance);
      const response = await categoriesResponse.v1ProductsCategoriesList();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Per CLAUDE.md: 5 minutes
    gcTime: 10 * 60 * 1000,   // Per CLAUDE.md: 10 minutes
    refetchOnWindowFocus: false, // Per CLAUDE.md: no refetch on focus
  });

  if (isError || error) {
    return (
      <div className="p-8">
        <p className="text-brav-error">
          Error loading products: {(error as Error).message}
        </p>
        <Button onClick={() => router.refresh()}>Retry</Button>
      </div>
    );
  }

  const handleAddToCart = (product: Product) => {
    router.push("/cart");
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (product: Product) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`,
      )
    ) {
      try {
        const productsApi = await getProducts(axiosInstance);
        await productsApi.v1ProductsProductsDestroy(product.slug);
        refetch();
      } catch (err) {
        console.error("Failed to delete product:", err);
      }
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
  };

  const handleSaveProduct = async (data: ProductRequest) => {
    try {
      console.log("Sending product data:", data);
      if (editingProduct) {
        // Update existing product
        const productsApi = await getProducts(axiosInstance);
        await productsApi.v1ProductsProductsPartialUpdate(editingProduct.slug, data);
      } else {
        // Create new product
        const productsApi = await getProducts(axiosInstance);
        await productsApi.v1ProductsProductsCreate(data);
      }
      setEditingProduct(null);
      refetch();
    } catch (err: any) {
      console.error("Failed to save product:", err);
      // If it's an axios error, we can get the response data
      if (err.response) {
        console.error("Response data:", err.response.data);
        alert("Failed to save product: " + (err.response.data?.message || err.response.data?.error || JSON.stringify(err.response.data)));
      } else {
        alert("Failed to save product: " + (err as Error)?.message);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleAddProductClick = () => {
    setEditingProduct(null);
  };

  const isAdmin = true; // Simplify for now, could check via useAuth

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  return (
    <>
      <section className="py-12 bg-brav-background">
        <div className="max-w-7xl mx-auto px-6">
          <ProductHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories ?? []}
            isLoading={isLoading || authIsLoading}
          />

          <ProductsGrid
            products={products ?? []}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Admin-only actions */}
          <Can permission="access_admin">
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                type="button"
                onClick={handleAddProductClick}
                className="rounded-brav-md bg-brav-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-brav-primary-hover"
              >
                Add Product
              </Button>

              <Button
                type="button"
                className="rounded-brav-md bg-brav-secondary px-4 py-2.5 text-sm font-medium text-brav-foreground hover:bg-brav-secondary-hover"
              >
                Edit Products
              </Button>

              <Button
                type="button"
                className="rounded-brav-md bg-brav-secondary px-4 py-2.5 text-sm font-medium text-brav-foreground hover:bg-brav-secondary-hover"
              >
                Manage Inventory
              </Button>
            </div>
          </Can>

          {products?.length === 0 && !isLoading && !authIsLoading && (
            <p className="col-span-full text-center text-brav-muted py-12">
              No products match your search. Try adjusting your filters.
            </p>
          )}
        </div>
      </section>

      {/* Add/Edit Product Form */}
      {editingProduct !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-brav-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-brav-heading mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>
            <ProductForm
              initial={editingProduct}
              onSave={handleSaveProduct}
              onClose={handleCancelEdit}
            />
          </div>
        </div>
      )}
    </>
  );
}