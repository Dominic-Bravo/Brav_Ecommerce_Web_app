"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import type { User } from "@/types/auth";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({
  user,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-brav-foreground">
          User Profile
        </h1>

        <p className="mt-2 text-brav-muted">
          Manage your personal information and profile settings.
        </p>

        <p className="mt-1 text-sm text-brav-muted">
          Signed in as {user.email}
        </p>
      </div>

      <LogoutButton />
    </div>
  );
}