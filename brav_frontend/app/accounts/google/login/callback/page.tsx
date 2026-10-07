"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { googleLogin } from "@/lib/api/auth";
import { authManager } from "@/lib/auth/AuthManager";
import { useAuth } from "@/context/AuthContext";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const hasProcessed = useRef(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    hasProcessed.current = true;

    async function handleGoogleCallback() {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const googleError = searchParams.get("error");

      if (googleError) {
        setError("Google login was cancelled.");
        return;
      }

      if (!code) {
        setError("Google did not return an authorization code.");
        return;
      }

      const savedState = sessionStorage.getItem("google_oauth_state");

      sessionStorage.removeItem("google_oauth_state");

      if (!state || !savedState || state !== savedState) {
        setError("Invalid Google OAuth state.");
        return;
      }

      try {
        const response = await googleLogin(code);

        authManager.setUser(response.user);

        // The access token is stored only in memory.
        // The refresh token is stored by the backend as an HttpOnly cookie.
        await authManager.setAccessToken(response.access);

        setUser(response.user);

        router.replace("/dashboard");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Google login failed."
        );
      }
    }

    handleGoogleCallback();
  }, [router, searchParams, setUser]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-brav-secondary px-4">
      <div className="w-full max-w-md rounded-brav-lg border border-brav-border bg-white p-8 text-center shadow-sm">
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-brav-text">
              Google Login Failed
            </h1>

            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="mt-6 rounded-brav-md bg-brav-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brav-primary-hover"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-brav-text">
              Signing you in
            </h1>

            <p className="mt-3 text-sm text-brav-muted">
              Completing Google authentication...
            </p>
          </>
        )}
      </div>
    </main>
  );
}