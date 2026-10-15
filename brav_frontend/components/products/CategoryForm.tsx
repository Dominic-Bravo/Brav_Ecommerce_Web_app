"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getCategoriesData } from "@/lib/api/categories";

import type {
  Category,
  CategoryRequest,
} from "@/api/generated/model";

interface CategoryFormProps {
  initial?: Category;
  onSave: (data: CategoryRequest) => void;
  onClose: () => void;
}

export default function CategoryForm({
  initial,
  onSave,
  onClose,
}: CategoryFormProps) {
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [image, setImage] = useState(initial?.image || "");
  const [isActive, setIsActive] = useState<boolean>(initial?.is_active ?? true);
  const [parent, setParent] = useState(initial?.parent || "");

  // Fetch categories from the server for the parent dropdown using useQuery
  // Per CLAUDE.md Rule 1: use Orval-generated hooks directly
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories-form"],
    queryFn: async () => {
      return getCategoriesData();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleSave = () => {
    const data: CategoryRequest = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description,
      image,
      is_active: isActive,
      parent: parent || undefined,
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
        placeholder="Category name"
        required
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary"
      />
      <input
        type="text"
        name="slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Category slug"
        required
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      />
      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Category description"
        rows={3}
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      />
      <input
        type="text"
        name="image"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Category image URL"
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      />

      <select
        name="parent"
        value={parent}
        onChange={(e) => setParent(e.target.value)}
        className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary mt-3"
      >
        <option value="">No parent category</option>
        {isCategoriesLoading || !categories ? (
          <option value="" disabled>Loading categories...</option>
        ) : (
          categories
            .filter((cat: Category) => cat.id !== (initial?.id || "")) // Exclude self if editing
            .map((cat: Category) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
        )}
      </select>

      <div className="mt-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2 h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-brav-foreground">Active</span>
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-brav-md bg-brav-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-brav-primary-hover"
        >
          Save Category
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