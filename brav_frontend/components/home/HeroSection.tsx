"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-secondary py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-accent/20" />
      <div className="relative mx-auto max-w-7xl px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Welcome to BRAV
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-200 sm:text-xl">
          Discover quality products at competitive prices with exceptional
          customer service.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="rounded-lg bg-brand-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-primary-hover"
          >
            Shop Now
          </Link>
          <Link
            href="/products"
            className="rounded-lg border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
          >
            Explore Categories
          </Link>
        </div>
      </div>
    </section>
  );
}