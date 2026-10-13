"use client";

import Image from "next/image";
import Link from "next/link";
import { useFeaturedProducts } from "@/lib/api/products";

export default function FeaturedProducts() {
  const { data: products, isLoading, error } = useFeaturedProducts();

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-3xl font-semibold text-brand-foreground">
            Featured Products
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-md border border-brand-border bg-white p-4"
              >
                <div className="aspect-square rounded-md bg-brand-foreground/10" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-brand-foreground/20" />
                  <div className="h-4 w-1/2 rounded bg-brand-foreground/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-3xl font-semibold text-brand-foreground">
            Featured Products
          </h2>
          <p className="text-brand-muted">Failed to load featured products.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-brand-foreground">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-brand-primary font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products?.map((product: any) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group rounded-md border border-brand-border bg-white p-4 transition-colors hover:border-brand-primary"
            >
              {product.image && (
                <div className="relative aspect-square overflow-hidden rounded-md">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}

              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-medium text-brand-foreground">
                  {product.name}
                </h3>
                {product.category && (
                  <p className="text-sm text-brand-muted">
                    {product.category.name}
                  </p>
                )}
                {product.price !== undefined && (
                  <p className="text-lg font-semibold text-brand-primary">
                    ${Number(product.price).toFixed(2)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}