"use client";

import { Can } from "@/components/auth/Can";
import ProductForm from "./ProductForm";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { fetchProducts, deleteProduct, createProduct, patchProduct } from "@/lib/api/products";

interface AdminProductsPanelProps {
  onProductAdded?: (product: any) => void;
}

export default function AdminProductsPanel({
  onProductAdded,
}: AdminProductsPanelProps) {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((p: any) => p.slug !== productId));
      // Invalidate queries after mutation as per CLAUDE.md rules
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const queryClient = useQueryClient();

  const handleSaveProduct = (data: any) => {
    if (editingProduct) {
      // Update existing product
      patchProduct(editingProduct.slug, {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        category: data.category,
        status: data.status,
        image_url: data.image_url,
        stock_quantity: data.stock_quantity,
        sku: data.sku,
      });
      setProducts(
        products.map((p: any) =>
          p.slug === editingProduct.slug ? data : p
        )
      );
      setEditingProduct(null);
    } else {
      // Create new product
      createProduct({
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        category: data.category,
        status: data.status,
        image_url: data.image_url,
        stock_quantity: data.stock_quantity,
        sku: data.sku,
      });
      setProducts([...products, data]);
    }
    // Invalidate queries after mutations as per CLAUDE.md rules
    queryClient.invalidateQueries({ queryKey: ["products"] });
    onProductAdded?.(data);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <p className="col-span-full text-center text-brav-muted">
        Loading products...
      </p>
    );
  }

  return (
    <section className="py-12 bg-brav-background">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-brav-heading mb-6">
          Product Management
        </h1>

        {/* Add Product button */}
        <Can permission="access_admin">
          <button
            type="button"
            onClick={handleAddProduct}
            className="rounded-brav-md bg-brav-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-brav-primary-hover mb-4"
          >
            Add New Product
          </button>
        </Can>

        {/* Products table */}
        <div className="overflow-x-auto rounded-brav-lg border border-brav-border bg-white shadow-sm mb-8">
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
              {products.map((product: any) => (
                <tr key={product.slug} className="border-b border-brav-border">
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
                    <Can permission="access_admin">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(product)}
                        className="mr-2 rounded-brav-md bg-brav-secondary px-2 py-1 text-xs font-medium text-brav-foreground hover:bg-brav-secondary-hover"
                      >
                        Edit
                      </button>
                    </Can>

                    <Can permission="access_admin">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.slug)}
                        className="ml-2 rounded-brav-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </Can>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Product form */}
        {showForm && (
          <ProductForm
            initial={editingProduct}
            onSave={(data) => handleSaveProduct(data)}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </section>
  );
}