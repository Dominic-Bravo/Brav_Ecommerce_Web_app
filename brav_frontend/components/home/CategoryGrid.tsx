"use client";

import Link from "next/link";
import { useCategories } from "@/lib/api/categories";

export default function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="section-spacing">
        <div className="page-container">
          <h2 className="section-heading mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="skeleton-line aspect-square rounded-brav-md"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing">
      <div className="page-container">
        <h2 className="section-heading mb-8">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories?.map((category: any) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group flex flex-col items-center gap-3 rounded-brav-md border border-ui-border bg-ui-bg p-6 text-center transition-colors hover:border-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ui-bg-muted text-brand-primary">
                {category.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-medium text-brand-primary">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}