"use client";

import Image from "next/image";
import Link from "next/link";
import { useFeaturedProducts } from "@/lib/api/products";

export default function FeaturedProducts() {
  const { data: products, isLoading, error } = useFeaturedProducts();

  const SkeletonCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-card-image" />
      <div className="skeleton-line-long" />
      <div className="skeleton-line-short" />
    </div>
  );

  const ProductCard = ({ product }: { product: any }) => (
    <Link
      href={`/products/${product.slug}`}
      className="product-card"
    >
      <div className="product-card-image-wrapper">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="h-full w-full object-cover object-center"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="image-placeholder h-full w-full">
            <span className="text-sm text-brand-muted">No image</span>
          </div>
        )}
      </div>
      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        {product.category && (
          <p className="product-card-meta">{product.category.name}</p>
        )}
        <div className="product-card-footer">
          {product.price !== undefined && (
            <p className="price-prominent">${Number(product.price).toFixed(2)}</p>
          )}
        </div>
      </div>
    </Link>
  );

  const showProducts = products && products.length > 0;

  if (isLoading) {
    return (
      <section className="section-spacing">
        <div className="page-container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="section-heading">
              Featured Products
            </h2>
            <span className="eyebrow">Curated for you</span>
          </div>
          <div className="product-grid">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-spacing">
        <div className="page-container">
          <div className="error-state">
            <span className="error-state-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="error-state-title">Something went wrong</span>
            <span className="error-state-description">
              We couldn't load the featured products. Please try again later.
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing">
      <div className="page-container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="section-heading">
            Featured Products
          </h2>
          <Link href="/products" className="nav-link">
            View all →
          </Link>
        </div>

        {showProducts ? (
          <div className="product-grid">
            {products.map((product: any) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 17H13M12 4V17M7 17H17M6.69 10.29C6.96451 11.1456 7.49216 11.8977 8.22043 12.4234C8.94869 12.9491 9.84179 13.2244 10.75 13.208C11.6582 13.1915 12.5368 12.7839 13.203 12.121C13.8691 11.4581 14.2845 10.5837 14.393 9.66303C14.5014 8.74236 14.2995 7.8217 13.8185 7.04378C13.3375 6.26586 12.7005 5.66558 11.9425 5.3109C11.1845 4.95622 10.3342 4.86088 9.53438 5.03823C8.73455 5.21557 7.99697 5.65893 7.4165 6.29997C6.83603 6.941 6.43073 7.74804 6.23604 8.60962" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 17C7 18.0323 6.86902 19.0387 6.61874 19.9743C6.36846 20.9099 5.99849 21.7558 5.53025 22.4697" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 17C17 18.0323 17.131 19.0387 17.3813 19.9743C17.6315 20.9099 18.0015 21.7558 18.4697 22.4697" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="empty-state-title">No featured products</span>
            <span className="empty-state-description">
              Come back soon — featured items rotate regularly.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}