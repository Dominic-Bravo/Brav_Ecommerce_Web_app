"use client";

import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: {
    value: string;
    label: string;
  }[];
}

export default function Select({
  label,
  error,
  id,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-brav-foreground"
      >
        {label}
      </label>

      <select
        id={id}
        className={cn(
          "w-full",
          "rounded-brav-md",
          "border",
          "bg-white",
          "px-4",
          "py-3",
          "text-sm",
          "text-brav-foreground",
          "outline-none",
          "transition",
          "focus:border-brav-primary",
          "focus:ring-2",
          "focus:ring-brav-primary/10",
          error ? "border-brav-error" : "border-brav-border",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-brav-error">
          {error}
        </p>
      )}
    </div>
  );
}