"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

/**
 * Global TanStack Query configuration per CLAUDE.md requirements:
 * - staleTime: 5 minutes (5 * 60 * 1000)
 * - gcTime: 10 minutes (10 * 60 * 1000)
 * - refetchOnWindowFocus: false (strictly locked)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}