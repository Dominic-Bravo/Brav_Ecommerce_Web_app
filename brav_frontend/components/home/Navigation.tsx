"use client";

import Link from "next/link";
import { ShoppingCart, User, Package, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useCartStore from "@/store/useCartStore";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const { isAuthenticated, user } = useAuth();
  const { items } = useCartStore();
  const pathname = usePathname();

  const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
  ];

  const isCurrentPath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href) || false;
  };

  const CartLink = () => (
    <Link
      href="/cart"
      className="relative rounded-brav-md border border-ui-border bg-white px-4 py-2 text-sm font-medium text-brand-primary transition-colors hover:border-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <ShoppingCart className="h-5 w-5" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-brand-accent text-xs font-semibold text-brand-primary">
          {cartItemCount}
        </span>
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-ui-border bg-ui-bg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
        <Link
          href="/"
          className="text-xl font-semibold text-brand-primary tracking-tight"
        >
          BRAV
        </Link>

        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-brav-md text-brand-primary hover:bg-ui-bg-muted focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:outline-none md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-4 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${
                  isCurrentPath(link.href) ? "nav-link-active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <>
                <CartLink />
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-brav-md border border-ui-border bg-white px-4 py-2 text-sm font-medium text-brand-primary transition-colors hover:border-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <User className="h-5 w-5" />
                  <span>{user.first_name}</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-2 rounded-brav-md border border-ui-border bg-white px-4 py-2 text-sm font-medium text-brand-primary transition-colors hover:border-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Package className="h-5 w-5" />
                  <span>Orders</span>
                </Link>
                <GoogleLoginButton isLogout />
              </>
            ) : (
              <>
                <CartLink />
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-brav-md border border-ui-border bg-white px-4 py-2 text-sm font-medium text-brand-primary transition-colors hover:border-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Sign in
                </Link>
                <Link href="/signup" className="btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}