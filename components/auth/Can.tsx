"use client";

import type { ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/auth/authorization";

import type { Permission } from "@/config/permissions";

interface CanProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function Can({
  permission,
  children,
  fallback = null,
}: CanProps) {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <>{fallback}</>;
  }

  if (!can(user.role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}