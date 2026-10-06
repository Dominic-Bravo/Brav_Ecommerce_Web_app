"use client";

import { useState } from "react";
import { startGoogleLogin } from "@/lib/auth/google";

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  function handleGoogleLogin() {
    try {
      setIsLoading(true);
      startGoogleLogin();
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-3 rounded-brav-md border border-brav-border bg-white px-4 py-3 text-sm font-medium text-brav-text transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? "Connecting to Google..." : "Continue with Google"}
    </button>
  );
}