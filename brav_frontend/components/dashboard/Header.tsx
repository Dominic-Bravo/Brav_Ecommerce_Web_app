"use client";

import { LogOut } from "lucide-react";

import type { User } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-brav-border bg-white px-6 py-4">
      <h1 className="text-2xl font-semibold text-brand-foreground">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-brand-muted">
            {user.first_name} {user.last_name}
          </div>
        )}

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-brav-md bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}