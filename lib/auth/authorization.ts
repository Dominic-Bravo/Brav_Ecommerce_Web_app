import type { UserRole } from "@/types/auth";
import {
  hasPermission,
  type Permission,
} from "@/config/permissions";

export function can(
  role: UserRole | undefined,
  permission: Permission
): boolean {
  if (!role) {
    return false;
  }

  return hasPermission(role, permission);
}

export function isRole(
  role: UserRole | undefined,
  expectedRole: UserRole
): boolean {
  return role === expectedRole;
}