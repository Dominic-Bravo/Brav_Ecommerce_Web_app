"use client";

import type { ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/auth/authorization";

import type { Permission } from "@/config/permissions";

/**
 * Can component for role-based access control
 * Per CLAUDE.md: Use <Can permission="access_admin"> for admin guards
 */
export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <>{fallback}</>;
  }

  if (!can(user.role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}