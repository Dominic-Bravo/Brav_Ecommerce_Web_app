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
        className="block text-sm font-medium text-brand-primary"
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
          "text-brand-foreground",
          "outline-none",
          "transition",
          "focus:border-brand-accent",
          "focus:ring-2",
          "focus:ring-brand-accent/10",
          error ? "border-ui-danger" : "border-brav-border",
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
        <p className="text-sm text-ui-danger">
          {error}
        </p>
      )}
    </div>
  );
}