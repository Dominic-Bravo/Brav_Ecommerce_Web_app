"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  /**
   * If true, shows a fallback UI instead of redirecting immediately.
   * Useful for pages that have both public and protected content.
   */
  fallback?: ReactNode;
}

const DEFAULT_AUTH_MESSAGE = "Please sign in to access this page.";

export default function ProtectedRoute({
  children,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    isLoading,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Preserve the intended destination in sessionStorage
      // so we can redirect back after successful login
      if (typeof window !== "undefined") {
        sessionStorage.setItem("authReturnPath", pathname);
      }
      router.replace("/login");
    }
  }, [
    isLoading,
    isAuthenticated,
    router,
    pathname,
  ]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brav-secondary">
        <p className="text-brav-muted">
          Checking authentication...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    // Show fallback if provided, otherwise render nothing (redirect handled by effect)
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  return <>{children}</>;
}

/**
 * Hook to get and clear the stored return path after login.
 * Returns the path or default "/dashboard" if none stored.
 */
export function useAuthReturnPath(): string {
  if (typeof window === "undefined") {
    return "/dashboard";
  }
  const path = sessionStorage.getItem("authReturnPath");
  sessionStorage.removeItem("authReturnPath");
  return path ?? "/dashboard";
}