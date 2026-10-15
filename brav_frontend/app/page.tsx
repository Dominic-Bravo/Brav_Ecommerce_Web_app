import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryGrid from "@/components/home/CategoryGrid";
import Navigation from "@/components/home/Navigation";

export default function Home() {
  return (
    <main className="min-h-screen bg-ui-bg">
      <Navigation />
      <HeroSection />
      <FeaturedProducts />
      <CategoryGrid />

      {/* Brand / story section — per DESIGN.md section 6, item 4 */}
      <section className="section-spacing">
        <div className="page-container">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="eyebrow mb-4 block">About BRAV</span>
              <h2 className="section-heading-serif mb-6">
                Designed for those who appreciate
                <br />
                understated luxury
              </h2>
              <p className="body-text">
                BRAV is a curated collection of timeless essentials. Every product
                is selected for its balance of form, function, and lasting quality —
                designed to be used every day, not just displayed.
              </p>
              <Link href="/products" className="btn-primary mt-6 inline-block">
                Explore the Collection
              </Link>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-brav-lg bg-ui-bg-muted">
              <div className="flex h-full w-full items-center justify-center text-brand-secondary">
                <span className="text-sm">Brand imagery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / service highlights — per DESIGN.md section 6, item 5 */}
      <section className="section-spacing bg-ui-bg-muted">
        <div className="page-container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ui-bg text-brand-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12L10 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <h3 className="mb-1 text-sm font-medium text-brand-primary">Free Shipping</h3>
              <p className="text-xs text-brand-muted">On orders over $50</p>
            </div>
            <div className="text-center">
              <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ui-bg text-brand-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12L10 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <h3 className="mb-1 text-sm font-medium text-brand-primary">Easy Returns</h3>
              <p className="text-xs text-brand-muted">30-day return window</p>
            </div>
            <div className="text-center">
              <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ui-bg text-brand-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12L10 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <h3 className="mb-1 text-sm font-medium text-brand-primary">24/7 Support</h3>
              <p className="text-xs text-brand-muted">Help when you need it</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}