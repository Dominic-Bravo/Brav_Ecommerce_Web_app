"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-brav-md font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  const variants = {
    primary:
      "bg-brand-accent text-brand-primary hover:bg-brand-accent-hover",

    secondary:
      "border border-ui-border bg-white text-brand-primary hover:bg-ui-bg-muted",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizes[size]}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}