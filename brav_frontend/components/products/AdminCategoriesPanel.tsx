"use client";

import { Can } from "@/components/auth/Can";
import CategoryForm from "./CategoryForm";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateCategory,
  useUpdateCategory,
  usePatchCategory,
  useDeleteCategory,
} from "@/lib/api/categories";
import { useCategories } from "@/lib/api/categories";

interface AdminCategoriesPanelProps {
  onCategoryAdded?: (category: any) => void;
}

export default function AdminCategoriesPanel({
  onCategoryAdded,
}: AdminCategoriesPanelProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Wait for initial data load, then set loading to false
  useEffect(() => {
    if (!isCategoriesLoading && categories !== undefined) {
      setIsLoading(false);
    }
  }, [isCategoriesLoading, categories]);

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const patchCategoryMutation = usePatchCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleSaveCategory = (data: any) => {
    if (editingCategory) {
      // Update existing category
      updateCategoryMutation.mutate({
        slug: editingCategory.slug,
        data,
      });
    } else {
      // Create new category
      createCategoryMutation.mutate(data);
    }
    onCategoryAdded?.(data);
    setShowForm(false);
    setEditingCategory(null);
  };

  if (isLoading || isCategoriesLoading) {
    return (
      <section className="p-8">
        <h1 className="text-3xl font-bold text-brav-heading mb-6">
          Category Management
        </h1>
        <p className="text-brav-muted">Loading categories...</p>
      </section>
    );
  }

  // If user is not admin, show access denied
  return (
    <Can permission="access_admin" fallback={null}>
      <section className="py-12 bg-brav-background">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-brav-heading mb-6">
            Category Management
          </h1>

          {/* Add Category button */}
          <Can permission="access_admin">
            <button
              type="button"
              onClick={handleAddCategory}
              className="rounded-brav-md bg-brav-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-brav-primary-hover mb-4"
            >
              Add New Category
            </button>
          </Can>

          {/* Categories table */}
          <div className="overflow-x-auto rounded-brav-lg border border-brav-border bg-white shadow-sm mb-8">
            <table className="min-w-full rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b border-brav-border text-brav-foreground">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Slug</th>
                  <th className="p-4 text-left">Parent</th>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Active</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((category: any) => (
                  <tr key={category.slug} className="border-b border-brav-border">
                    <td className="p-4">{category.name}</td>
                    <td className="p-4">{category.slug}</td>
                    <td className="p-4">{category.parent || "-"}</td>
                    <td className="p-4">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={`${category.name} image`}
                          className="h-6 w-auto object-contain"
                        />
                      ) : (
                        <span className="text-sm text-brav-muted">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded px-2 py-1 text-sm ${
                          category.is_active
                            ? "bg-brav-primary text-white"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.is_active ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <Can permission="access_admin">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(category)}
                            className="rounded-brav-md bg-brav-secondary px-2 py-1 text-xs font-medium text-brav-foreground hover:bg-brav-secondary-hover"
                          >
                            Edit
                          </button>
                        </Can>

                        <Can permission="access_admin">
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category.slug)}
                            className="rounded-brav-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {categories?.length === 0 && (
              <div className="p-8 text-center text-brav-muted">
                No categories found
              </div>
            )}
          </div>

          {/* Category form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-brav-lg p-6 max-w-2xl w-full mx-4">
                <h2 className="text-2xl font-bold mb-4">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <CategoryForm
                  initial={editingCategory}
                  onSave={(data) => handleSaveCategory(data)}
                  onClose={() => setShowForm(false)}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </Can>
  );
}