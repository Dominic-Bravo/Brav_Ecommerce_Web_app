"use client";

import { useState } from "react";
import { startGoogleLogin } from "@/lib/auth/google";
import type { LucideIcon } from "lucide-react";
import { LogIn, LogOut } from "lucide-react";

interface GoogleLoginButtonProps {
  isLogout?: boolean;
  variant?: "default" | "text" | "outline";
  size?: "default" | "sm" | "icon";
}

const icons: Record<string, LucideIcon> = {
  LogIn: LogIn,
  LogOut: LogOut,
};

export default function GoogleLoginButton({
  isLogout = false,
  variant = "default",
  size = "default",
}: GoogleLoginButtonProps = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const Icon = icons[isLogout ? "LogOut" : "LogIn"];

  function handleGoogleLogin() {
    if (isLogout) {
      window.location.href = "/logout";
      return;
    }
    try {
      setIsLoading(true);
      startGoogleLogin();
    } catch {
      setIsLoading(false);
    }
  }

  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-brav-md border border-brav-border bg-white px-4 py-2 text-sm font-medium text-brav-text transition-all disabled:cursor-not-allowed disabled:opacity-50";

  const sizeClasses = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-xs",
    icon: "h-10 w-10",
  };

  const variantClasses = {
    default: "bg-white text-brav-text hover:bg-gray-50",
    text: "bg-transparent text-brav-foreground hover:bg-brand-secondary/10",
    outline: "bg-transparent text-brav-foreground hover:bg-brand-secondary/10",
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {isLoading
        ? "Connecting..."
        : isLogout
        ? "Log out"
        : "Continue with Google"}
      {!isLoading && !isLogout && <Icon className="h-4 w-4" />}
    </button>
  );
}