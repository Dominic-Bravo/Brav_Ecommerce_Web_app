"use client";

import { Can } from "@/components/auth/Can";
import CategoryForm from "./CategoryForm";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getCategoriesData } from "@/lib/api/categories";
import { deleteCategory, createCategory, patchCategory } from "@/lib/api/products";

interface AdminCategoriesPanelProps {
  onCategoryAdded?: (category: any) => void;
}

export default function AdminCategoriesPanel({
  onCategoryAdded,
}: AdminCategoriesPanelProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategoriesData();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

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
      await deleteCategory(categoryId);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCategories(categories.filter((c: any) => c.slug !== categoryId));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleSaveCategory = (data: any) => {
    if (editingCategory) {
      // Update existing category
      patchCategory(editingCategory.slug, {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        is_active: data.is_active,
        parent: data.parent,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCategories(
        categories.map((c: any) =>
          c.slug === editingCategory.slug ? data : c
        )
      );
      setEditingCategory(null);
    } else {
      // Create new category
      createCategory({
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        is_active: data.is_active,
        parent: data.parent,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCategories([...categories, data]);
    }
    onCategoryAdded?.(data);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <p className="col-span-full text-center text-brav-muted">
        Loading categories...
      </p>
    );
  }

  return (
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
              {categories.map((category: any) => (
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
                    <Can permission="access_admin">
                      <button
                        type="button"
                        onClick={() => handleEditCategory(category)}
                        className="mr-2 rounded-brav-md bg-brav-secondary px-2 py-1 text-xs font-medium text-brav-foreground hover:bg-brav-secondary-hover"
                      >
                        Edit
                      </button>
                    </Can>

                    <Can permission="access_admin">
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category.slug)}
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

        {/* Category form */}
        {showForm && (
          <CategoryForm
            initial={editingCategory}
            onSave={(data) => handleSaveCategory(data)}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </section>
  );
}