import type {
  SignupFormData,
  RegisterResponse,
  TestApiData,
  LoginFormData,
  LoginResponse,
  User,
} from "@/types/auth";

import { apiClient } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

export async function googleLogin(code: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/v1/users/auth/google/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      code,
    }),
  });

  const responseData = await response.json();

  console.log("Google login status:", response.status);
  console.log("Google login response:", responseData);

  if (!response.ok) {
    throw new Error(
      responseData?.detail ||
      responseData?.message ||
      responseData?.non_field_errors?.[0] ||
      JSON.stringify(responseData) ||
      "Google login failed."
    );
  }

  return responseData;
}



export async function loginUser(
  data: LoginFormData
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/v1/users/login/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      credentials: "include",

      body: JSON.stringify(data),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData?.detail ||
        responseData?.message ||
        responseData?.non_field_errors?.[0] ||
        "Login failed."
    );
  }

  return responseData;
}


export async function refreshAccessToken(): Promise<string> {
  const response = await fetch(
    `${API_URL}/v1/users/token/refresh/`,
    {
      method: "POST",

      headers: {
        Accept: "application/json",
      },

      // This sends the HttpOnly refresh cookie.
      credentials: "include",
    }
  );

  const responseData: RefreshResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      "Refresh token is invalid or expired."
    );
  }

  return responseData.access;
}


export async function getCurrentUser(
  accessToken: string
): Promise<User> {
  const response = await fetch(
    `${API_URL}/v1/users/me/`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      credentials: "include",
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData?.detail ||
        responseData?.message ||
        "Failed to get current user."
    );
  }

  return responseData;
}


export async function logoutUser(
  accessToken: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/v1/users/logout/`,
    {
      method: "POST",

      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      credentials: "include",
    }
  );

  if (!response.ok) {
    const responseData =
      await response.json().catch(() => ({}));

    throw new Error(
      responseData?.detail ||
        responseData?.message ||
        "Logout failed."
    );
  }
}

// @/lib/api/auth.ts

export interface TestApiData {
  message: string;
  role: string;
}

// lib/api/auth.ts

export async function testapi(): Promise<TestApiData> {
  // 1. Double-check that API_URL does not end up with double slashes (e.g. //api/v1)
  // 2. Ensure it ends exactly with a trailing slash as expected by DRF
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const response = await fetch(`${baseUrl}/v1/users/test/anonymous/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}





export async function registerUser(
  data: SignupFormData
): Promise<RegisterResponse> {
  const response = await fetch(
    `${API_URL}/v1/users/register/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const responseData = await response.json();

  console.log("REGISTER STATUS:", response.status);
  console.log("REGISTER RESPONSE:", responseData);

  if (!response.ok) {
    throw new Error(
      responseData?.detail ||
        responseData?.message ||
        JSON.stringify(responseData) ||
        "Registration failed"
    );
  }

  return responseData;
}
