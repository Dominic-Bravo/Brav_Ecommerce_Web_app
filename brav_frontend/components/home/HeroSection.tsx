"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-ui-bg py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5" />
      <div className="relative mx-auto max-w-7xl px-4 text-center">
        <h1 className="mb-6 text-4xl font-semibold tracking-tight text-brand-primary sm:text-5xl md:text-6xl lg:text-7xl">
          Curated Collections<br />of Timeless Design
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-brand-secondary sm:text-lg">
          Discover thoughtfully selected products that blend functionality with elegance,
          crafted for those who appreciate understated luxury in everyday essentials.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="btn-primary"
          >
            Start Shopping
          </Link>
          <Link
            href="/products"
            className="btn-secondary"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </section>
  );
}