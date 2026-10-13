import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Unified class builder using CVA + clsx + tailwind-merge
 * Handles responsive modifiers without class collisions
 *
 * Accepts variadic class arguments and merges them with twMerge
 * to prevent class collisions and deduplicate styles.
 *
 * @param inputs - Variable class names, arrays, or conditional classes
 * @returns Merged and deduplicated class string
 *
 * Usage: cn("bg-primary", "hover:bg-primary-hover", conditionalClass)
 * Usage: cn(["bg-primary", "md:hover:bg-secondary"])
 */
export function cn(...inputs: any[]) {
  // Flatten arrays and filter falsy values
  const flattened = inputs
    .flat()
    .filter((input) => input !== undefined && input !== null && input !== false);

  return twMerge(clsx(...flattened));
}