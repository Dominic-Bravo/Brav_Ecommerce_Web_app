"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);

      await logout();

      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="
        rounded-brav-md
        bg-brav-primary
        px-4
        py-2
        text-sm
        font-medium
        text-white
        transition
        hover:bg-brav-primary-hover
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}