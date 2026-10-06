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
        className="block text-sm font-medium text-brav-foreground"
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
          text-brav-foreground
          outline-none
          transition
          placeholder:text-brav-muted
          focus:border-brav-primary
          focus:ring-2
          focus:ring-brav-primary/10
          ${error ? "border-brav-error" : "border-brav-border"}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-sm text-brav-error">
          {error}
        </p>
      )}
    </div>
  );
}