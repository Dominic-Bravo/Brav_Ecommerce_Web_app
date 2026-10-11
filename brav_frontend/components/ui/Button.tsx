"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  size?: "sm" | "md";
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
  };

  const variants = {
    primary:
      "bg-brav-primary text-white hover:bg-brav-primary-hover",

    secondary:
      "bg-brav-secondary text-brav-foreground hover:bg-brav-secondary-hover",
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