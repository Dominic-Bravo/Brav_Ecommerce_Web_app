import type { UserRole } from "@/types/auth";

export type Permission =
  | "access_authenticated"
  | "access_customer"
  | "access_admin";

const rolePermissions: Record<
  UserRole,
  readonly Permission[]
> = {
  customer: [
    "access_authenticated",
    "access_customer",
  ],

  admin: [
    "access_authenticated",
    "access_admin",
  ],
};

export function hasPermission(
  role: UserRole,
  permission: Permission
): boolean {
  return rolePermissions[role].includes(permission);
}