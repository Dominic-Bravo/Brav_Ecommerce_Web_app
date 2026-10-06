import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});



export const signupSchema = z
  .object({
    email: z.email("Please enter a valid email address"),

    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters"),

    last_name: z
      .string()
      .min(2, "Last name must be at least 2 characters"),

    phone: z
      .string()
      .min(10, "Please enter a valid phone number"),

    role: z.enum(["admin", "customer"], {
      message: "Please select an account type.",
    }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    password_confirm: z.string(),
  })
  .refine(
    (data) => data.password === data.password_confirm,
    {
      message: "Passwords do not match",
      path: ["password_confirm"],
    }
  );