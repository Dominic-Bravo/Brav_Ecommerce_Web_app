"use client";

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-brand-primary"
      >
        {label}
      </label>

      <input
        id={id}
        className={`
          w-full
          rounded-brav-md
          border
          bg-white
          px-4
          py-3
          text-sm
          text-brand-foreground
          outline-none
          transition
          placeholder:text-brand-muted
          focus:border-brand-accent
          focus:ring-2
          focus:ring-brand-accent/10
          ${error ? "border-ui-danger" : "border-brav-border"}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-sm text-ui-danger">
          {error}
        </p>
      )}
    </div>
  );
}