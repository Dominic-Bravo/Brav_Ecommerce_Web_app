"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { loginSchema } from "@/schemas/auth";
import type { LoginFormData } from "@/types/auth";

import { authManager } from "@/lib/auth/AuthManager";
import { useAuth } from "@/context/AuthContext";

import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function LoginForm() {
  const router = useRouter();

  const { setUser } = useAuth();

  const [serverError, setServerError] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError("");

    try {
      const response =
        await authManager.login(data);

      // Synchronize the authenticated
      // user with AuthContext.
      setUser(response.user);

      // Navigate to the protected dashboard.
      router.replace("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Unable to login.");
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <div>
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          {...register("password")}
        />

        {errors.password && (
          <p className="mt-1 text-sm text-brav-error">
            {errors.password.message}
          </p>
        )}

        <div className="mt-2 text-right">
          <Link
            href="/forgot-password"
            className="text-sm font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      {serverError && (
        <div className="rounded-brav-md bg-red-50 p-3 text-sm text-brav-error">
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Signing in..."
          : "Sign in"}
      </Button>

      <div className="mt-6">
        <GoogleLoginButton />
      </div>

      <p className="text-center text-sm text-brav-muted">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}