"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "@/components/ui/Select";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { signupSchema } from "@/schemas/auth";
import type { SignupFormData } from "@/types/auth";
import { registerUser } from "@/lib/api/auth";

import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function SignupForm() {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    console.log("DATA BEING SENT:", data);

    try {
      const response = await registerUser(data);

      console.log("REGISTER SUCCESS:", response);
      alert("registered successfully");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      if (error instanceof Error) {
        setServerError(error.message);
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* First Name */}

      <Input
        id="first_name"
        label="First name"
        placeholder="John"
        autoComplete="given-name"
        {...register("first_name")}
        error={errors.first_name?.message}
      />

      {/* Last Name */}

      <Input
        id="last_name"
        label="Last name"
        placeholder="Doe"
        autoComplete="family-name"
        {...register("last_name")}
        error={errors.last_name?.message}
      />

      {/* Email */}

      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        {...register("email")}
        error={errors.email?.message}
      />

      {/* Phone */}

      <Input
        id="phone"
        type="tel"
        label="Phone number"
        placeholder="09123456789"
        autoComplete="tel"
        {...register("phone")}
        error={errors.phone?.message}
      />

      {/* Select role */}
      <Select
        id="role"
        label="Account type"
        {...register("role")}
        error={errors.role?.message}
        options={[
          {
            value: "customer",
            label: "Customer",
          },
          {
            value: "admin",
            label: "Admin",
          },
        ]}
      />

      {/* Password */}

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="Create a password"
        autoComplete="new-password"
        {...register("password")}
        error={errors.password?.message}
      />

      {/* Confirm Password */}

      <Input
        id="password_confirm"
        type="password"
        label="Confirm password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        {...register("password_confirm")}
        error={errors.password_confirm?.message}
      />

      {/* Server Error */}

      {serverError && (
        <div className="rounded-brav-md bg-red-50 p-3 text-sm text-brav-error">
          {serverError}
        </div>
      )}

      {/* Submit */}

      <Button
        type="submit"
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Creating account..."
          : "Create account"}
      </Button>

      <div className="mt-6">
        <GoogleLoginButton />
      </div>

      <p className="text-center text-sm text-brav-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-brav-foreground hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}