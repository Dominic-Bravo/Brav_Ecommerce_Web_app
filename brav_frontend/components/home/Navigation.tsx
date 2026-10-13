"use client";

import Link from "next/link";
import { ShoppingCart, User, Package, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useCartStore from "@/store/useCartStore";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function Navigation() {
  const { isAuthenticated, user } = useAuth();
  const { items } = useCartStore();

  const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
  ];

  const cartButton = (
    <Link
      href="/cart"
      className="relative rounded-md border border-brand-border bg-white px-4 py-2 transition-colors hover:border-brand-primary"
    >
      <ShoppingCart className="h-5 w-5 text-brand-foreground" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
          {cartItemCount}
        </span>
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-brand-foreground">
          BRAV
        </Link>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-muted hover:text-brand-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && user ? (
            <>
              {cartButton}
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-md border border-brand-border bg-white px-4 py-2 transition-colors hover:border-brand-primary"
              >
                <User className="h-5 w-5 text-brand-foreground" />
                <span className="text-sm font-medium text-brand-foreground">
                  {user.first_name}
                </span>
              </Link>
              <Link
                href="/cart"
                className="relative rounded-md border border-brand-border bg-white px-4 py-2 transition-colors hover:border-brand-primary"
              >
                <ShoppingCart className="h-5 w-5 text-brand-foreground" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-2 rounded-md border border-brand-border bg-white px-4 py-2 transition-colors hover:border-brand-primary"
              >
                <Package className="h-5 w-5 text-brand-foreground" />
                <span className="text-sm font-medium text-brand-foreground">
                  Orders
                </span>
              </Link>
              <GoogleLoginButton isLogout />
            </>
          ) : (
            <>
              {cartButton}
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-md border border-brand-border bg-white px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:border-brand-primary"
              >
                <LogIn className="h-5 w-5" />
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}