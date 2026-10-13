"use client";

import Link from "next/link";
import { useCategories } from "@/lib/api/categories";

export default function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-3xl font-semibold text-brand-foreground">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-md border border-brand-border bg-brand-secondary p-4"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-3xl font-semibold text-brand-foreground">
          Shop by Category
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {categories?.map((category: any) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group rounded-md border border-brand-border bg-white p-6 text-center transition-colors hover:border-brand-primary"
            >
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary/20 text-brand-primary">
                {category.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-medium text-brand-foreground">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}