"use client";

import { useRouter } from "next/navigation";

import { authManager } from "@/lib/auth/AuthManager";

export default function LogoutButton() {

  const router = useRouter();

  async function handleLogout() {

    await authManager.logout();

    router.replace("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-brav-md bg-brav-primary px-4 py-2 text-white"
    >
      Logout
    </button>
  );
}