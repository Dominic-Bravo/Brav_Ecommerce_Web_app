"use client";

import {
  type ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/auth";

interface RoleGuardProps {
  role: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RoleGuard({
  role,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <>{fallback}</>;
  }

  if (user.role !== role) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}