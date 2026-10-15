/**
 * Users API layer.
 *
 * Uses the apiFetch function from lib/api/client for authenticated requests.
 * Fetches user data from the backend.
 */

import { apiFetch } from "./client";
import type { User } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

/**
 * Fetch all users from the backend.
 *
 * Maps the backend user response to local User type.
 * The backend returns a wrapped envelope { data: User[] }, so we unwrap it.
 */
export async function getUsersApi(): Promise<User[]> {
  try {
    const response = await apiFetch("/v1/users/", {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.detail ||
          errorData?.message ||
          "Failed to fetch users."
      );
    }

    const data = await response.json();

    // Backend returns { data: User[] } or directly an array
    const users = Array.isArray(data) ? data : (data?.data || []);

    // Map backend user format to local User type
    return users.map((user: any) => ({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch users."
    );
  }
}