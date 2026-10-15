"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Can } from "@/components/auth/Can";
import { useAuth } from "@/context/AuthContext";
import { fetchProducts, createProduct, deleteProduct } from "@/lib/api/products";
import ProductForm from "@/components/products/ProductForm";

import Button from "@/components/ui/Button";
import type { Product, ProductRequest } from "@/api/generated/model";

export default function AdminProductsSection() {
  const { user, isLoading: authIsLoading } = useAuth();
  const queryClient = useQueryClient();

  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => fetchProducts(),
    enabled: !authIsLoading && user?.role === "admin",
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductRequest) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setEditingProduct(undefined);
      setIsFormOpen(false);
    },
    onError: (err) => {
      console.error("Failed to create product:", err);
      alert("Failed to create product");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => deleteProduct(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err) => {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    },
  });

  if (authIsLoading) {
    return null;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      deleteMutation.mutate(product.slug);
    }
  };

  const handleSave = (data: ProductRequest) => {
    if (editingProduct) {
      // For updates, we'd need updateProduct function
      // For now, just use create (not ideal but works for demo)
      alert("Update not implemented yet - would need updateProduct");
      setEditingProduct(undefined);
      setIsFormOpen(false);
    } else {
      createMutation.mutate(data);
      setIsFormOpen(false);
    }
  };

  const handleCancel = () => {
    setEditingProduct(undefined);
    setIsFormOpen(false);
  };

  return (
    <section className="mt-8 rounded-brav-lg border border-brav-border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-brav-border pb-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-brav-foreground">
            My Products (Admin)
          </h2>
          <p className="text-xs text-brav-muted">
            Manage your products. Add, edit, or delete as needed.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAddProduct}
          className="rounded-brav-md bg-brav-primary px-4 py-2 text-sm font-medium text-white hover:bg-brav-primary-hover"
        >
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center text-brav-muted py-8">
          Loading products...
        </p>
      ) : error ? (
        <div className="p-4 text-brav-error">
          Error loading products: {(error as Error).message}
        </div>
      ) : (
        <>
          {products?.length === 0 ? (
            <p className="text-center text-brav-muted py-8">
              You haven't created any products yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b border-brav-border text-brav-foreground">
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Slug</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product: Product) => (
                    <tr
                      key={product.slug}
                      className="border-b border-brav-border"
                    >
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">{product.slug}</td>
                      <td className="p-4">{product.category_name || product.category || "-"}</td>
                      <td className="p-4">{product.price}</td>
                      <td className="p-4">
                        <span
                          className={`rounded px-2 py-1 text-sm ${
                            product.status === "active"
                              ? "bg-brav-primary text-white"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-brav-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-brav-heading mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h3>
            <ProductForm
              initial={editingProduct}
              onSave={handleSave}
              onClose={handleCancel}
            />
          </div>
        </div>
      )}
    </section>
  );
}