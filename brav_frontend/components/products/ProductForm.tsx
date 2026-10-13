"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/api/generated/categories/categories";

import type {
  Product,
  ProductRequest,
  PatchedProductRequest,
  Category,
  ProductStatusEnum,
} from "@/api/generated/model";

interface ProductFormProps {
  initial?: Product | undefined;
  onSave: (data: ProductRequest) => void;
  onClose: () => void;
}

export default function ProductForm({
  initial,
  onSave,
  onClose,
}: ProductFormProps) {
  // Initialize state — when initial is undefined/null we create an empty form
  // when initial is provided we pre-fill from the existing product.
  const defaultName = initial?.name || "";
  const defaultSlug = initial?.slug || defaultName.toLowerCase().replace(/\s+/g, "-");
  const defaultDescription = initial?.description || "";
  const defaultPrice = (initial?.price ?? "0") as string;
  const defaultCategory = initial?.category || "";
  const defaultStatus = initial?.status || "active";
  const defaultImageUrl = initial?.image_url || "";
  const defaultStockQuantity = (initial?.stock_quantity ?? "") as string;
  const defaultSku = initial?.sku || "";

  const [name, setName] = useState(defaultName);
  const [slug, setSlug] = useState(defaultSlug);
  const [description, setDescription] = useState(defaultDescription);
  const [price, setPrice] = useState(defaultPrice);
  const [category, setCategory] = useState(defaultCategory);
  const [status, setStatus] = useState<ProductStatusEnum>(defaultStatus as ProductStatusEnum);
  const [imageUrl, setImageUrl] = useState(defaultImageUrl);
  const [stockQuantity, setStockQuantity] = useState(defaultStockQuantity);
  const [sku, setSku] = useState(defaultSku);

  // Fetch categories from the server for the dropdown using useQuery
  // Per CLAUDE.md Rule 1: use Orval-generated hooks directly
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories-form"],
    queryFn: async () => {
      const categoriesResponse = await getCategories();
      const response = await categoriesResponse.v1ProductsCategoriesList();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleSave = () => {
    // Ensure price is never empty - always send a valid number string
    const finalPrice = price || "0";

    // Ensure stock_quantity is always a valid number - default to 0 if empty/invalid
    const finalStockQty =
      stockQuantity != null && stockQuantity !== "" && Number(stockQuantity) >= 0
        ? Number(stockQuantity)
        : 0;

    // Send category slug - backend resolves it to Category UUID
    const finalCategory = category || "";

    const data: ProductRequest = {
      category: finalCategory,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description,
      price: finalPrice as string,
      status,
      stock_quantity: finalStockQty,
      sku: sku || "",
      image_url: imageUrl || undefined,
    };
    onSave(data);
  };

  return (
    <>
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
        required
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary"
      />
      <input
        type="text"
        name="slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Product slug"
        required
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      />
      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Product description"
        rows={3}
        required
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      />
      <input
        type="text"
        name="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price (PHP)"
        required
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      />

      <input
        type="text"
        name="sku"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        placeholder="SKU (e.g., ABC123)"
        required
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      />

      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      >
        <option value="">Select category</option>
        {isCategoriesLoading || !categories ? (
          <option value="" disabled>Loading categories...</option>
        ) : (
          categories.map((cat: Category) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))
        )}
      </select>

      <select
        name="status"
        value={status}
        onChange={(e) => setStatus(e.target.value as ProductStatusEnum)}
        required
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <input
        type="text"
        name="image_url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL (optional)"
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      />

      <input
        type="number"
        name="stock_quantity"
        value={stockQuantity}
        onChange={(e) => setStockQuantity(e.target.value)}
        placeholder="Stock quantity (optional)"
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      />

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-brav-md bg-brav-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-brav-primary-hover"
        >
          Save Product
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-brav-md bg-brav-secondary px-4 py-2.5 text-sm font-medium text-brav-foreground hover:bg-brav-secondary-hover"
        >
          Cancel
        </button>
      </div>
    </>
  );
}