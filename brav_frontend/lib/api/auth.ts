import type {
  SignupFormData,
  RegisterResponse,
  TestApiData,
  LoginFormData,
  LoginResponse,
  UpdateUserPayload,
  UpdateProfilePayload,
  RefreshResponse,
  UserProfile,
  User,
} from "@/types/auth";

import { apiClient } from "./client";

/**
 * Users API layer (Auth).
 *
 * All functions use the centralized `apiClient` which handles:
 * - Base URL stripping
 * - Token injection via AuthManager
 * - Automatic error unwrapping and throwing
 */

export async function deleteAccountApi(): Promise<void> {
  await apiClient("/v1/users/me/", {
    method: "DELETE",
  });
}

export async function updateUserApi(
  payload: UpdateUserPayload
): Promise<User> {
  return apiClient<User>("/v1/users/me/", {
    method: "PATCH",
    body: payload,
  });
}

export async function updateProfileApi(
  payload: UpdateProfilePayload
): Promise<UserProfile> {
  return apiClient<UserProfile>("/v1/users/me/profile/", {
    method: "PATCH",
    body: payload,
  });
}

export async function getProfileApi(): Promise<UserProfile> {
  return apiClient<UserProfile>("/v1/users/me/profile/");
}

export async function googleLogin(code: string): Promise<LoginResponse> {
  return apiClient<LoginResponse>(`/api/v1/users/auth/google/`, {
    method: "POST",
    body: {
      code,
    },
  });
}

export async function loginUser(
  data: LoginFormData
): Promise<LoginResponse> {
  return apiClient<LoginResponse>(`/v1/users/login/`, {
    method: "POST",
    body: data,
  });
}

export async function refreshAccessToken(): Promise<string> {
  const response = await apiClient<RefreshResponse>(`/api/v1/users/token/refresh/`, {
    method: "POST",
  });

  return response.access;
}

export async function getCurrentUser(): Promise<User> {
  return apiClient<User>(`/v1/users/me/`);
}

export async function logoutUser(): Promise<void> {
  await apiClient(`/v1/users/logout/`, {
    method: "POST",
  });
}

export async function testapi(): Promise<TestApiData> {
  return apiClient<TestApiData>(`/v1/users/test/anonymous/`);
}

export async function registerUser(
  data: SignupFormData
): Promise<RegisterResponse> {
  return apiClient<RegisterResponse>(`/v1/users/register/`, {
    method: "POST",
    body: data,
  });
}
